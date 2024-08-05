import type { Migration } from ".";
import { collections } from "$lib/server/database";
import { ObjectId } from "mongodb";

const updateConversationsLastActivityAt: Migration = {
	_id: new ObjectId("000000000092"),
	name: "Update all conversations without a lastActivityAt field to have a lastActivityAt field set to updatedAt",
	up: async () => {
		const result = await collections.conversations.updateMany(
			{ lastActivityAt: { $exists: false } },
			[{ $set: { lastActivityAt: "$updatedAt" } }]
		);

		console.log(`Updated ${result.modifiedCount} conversations`);
		return true;
	},
	runEveryTime: false,
};

export default updateConversationsLastActivityAt;
