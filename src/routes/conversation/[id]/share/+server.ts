import { authCondition } from "$lib/server/auth";
import { collections } from "$lib/server/database";
import type { SharedConversation } from "$lib/types/SharedConversation";
import { getShareUrl } from "$lib/utils/getShareUrl";
import { hashConv } from "$lib/utils/hashConv";
import { error } from "@sveltejs/kit";
import { ObjectId } from "mongodb";
import { nanoid } from "nanoid";
import { SLACK_WEBHOOK_URL } from "$env/static/private";

export async function POST({ params, url, locals }) {
	// TODO: seems like this should be a PUT rather than a POST since it's an update
	const conversation = await collections.conversations.findOne({
		_id: new ObjectId(params.id),
		...authCondition(locals),
	});

	if (!conversation) {
		throw error(404, "Conversation not found");
	}

	// Update the conversation to set shared to true
	await collections.conversations.updateOne(
		{ _id: new ObjectId(params.id), ...authCondition(locals) },
		{ $set: { shared: true, lastActivityAt: new Date() } }
	);

	const hash = await hashConv(conversation);

	const existingShare = await collections.sharedConversations.findOne({ hash });

	if (existingShare) {
		return new Response(
			JSON.stringify({
				url: getShareUrl(url, existingShare._id),
			}),
			{ headers: { "Content-Type": "application/json" } }
		);
	}

	const shared: SharedConversation = {
		_id: nanoid(7),
		hash,
		createdAt: new Date(),
		updatedAt: new Date(),
		rootMessageId: conversation.rootMessageId,
		messages: conversation.messages,
		title: conversation.title,
		model: conversation.model,
		embeddingModel: conversation.embeddingModel,
		preprompt: conversation.preprompt,
		assistantId: conversation.assistantId,
	};

	await collections.sharedConversations.insertOne(shared);

	// Send notification to Slack
	if (SLACK_WEBHOOK_URL) {
		try {
			await fetch(SLACK_WEBHOOK_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					text: `<${getShareUrl(url, conversation._id.toString())}|${conversation.title}>`,
				}),
			});
		} catch (error) {
			console.error("Failed to send Slack notification:", error);
		}
	}

	// copy files from `${conversation._id}-` to `${shared._id}-`
	const files = await collections.bucket
		.find({ filename: { $regex: `${conversation._id}-` } })
		.toArray();

	await Promise.all(
		files.map(async (file) => {
			const newFilename = file.filename.replace(`${conversation._id}-`, `${shared._id}-`);
			// copy files from `${conversation._id}-` to `${shared._id}-` by downloading and reuploaidng
			const downloadStream = collections.bucket.openDownloadStream(file._id);
			const uploadStream = collections.bucket.openUploadStream(newFilename, {
				metadata: { ...file.metadata, conversation: shared._id.toString() },
			});
			downloadStream.pipe(uploadStream);
		})
	);

	return new Response(
		JSON.stringify({
			url: getShareUrl(url, shared._id),
		}),
		{ headers: { "Content-Type": "application/json" } }
	);
}
