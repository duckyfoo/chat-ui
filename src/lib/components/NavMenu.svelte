<script lang="ts">
	import { base } from "$app/paths";

	import { writable } from 'svelte/store'; 
	import Logo from "$lib/components/icons/Logo.svelte";
	import { switchTheme } from "$lib/switchTheme";
	import { isAborted } from "$lib/stores/isAborted";
	import { env as envPublic } from "$env/dynamic/public";
	import NavConversationItem from "./NavConversationItem.svelte";
	import type { LayoutData } from "../../routes/$types";
	import type { ConvSidebar } from "$lib/types/ConvSidebar";
	import type { Model } from "$lib/types/Model";
	import { page } from "$app/stores";

	export let conversations: ConvSidebar[] = [];
	export let publicConversations: ConvSidebar[] = [];
	export let canLogin: boolean;
	export let user: LayoutData["user"];
	export let currentConversationId: string | null = null;

	function handleNewChatClick() {
		isAborted.set(true);
	}

	const dateRanges = [
		new Date().setDate(new Date().getDate() - 1),
		new Date().setDate(new Date().getDate() - 7),
		new Date().setMonth(new Date().getMonth() - 1),
	];


	const titles: { [key: string]: string } = {
		today: "Past day",
		week: "Past week",
		month: "Past month",
		older: "Older",
	} as const;
	
	const nModels: number = $page.data.models.filter((el: Model) => !el.unlisted).length;
	
	const activeTab = writable('mine');
	$: currentConversation = conversations.find(conv => conv.id === currentConversationId);
	$: if (currentConversation || currentConversationId === null) {
		activeTab.set('mine');
	} else {
		activeTab.set('public');
	}
	
	$: filteredConversations = conversations;
	
	$: groupedConversations = {
		today: filteredConversations.filter(({ lastActivityAt }) => lastActivityAt.getTime() > dateRanges[0]),
		week: filteredConversations.filter(
		({ lastActivityAt }) => lastActivityAt.getTime() > dateRanges[1] && lastActivityAt.getTime() < dateRanges[0]
		),
		month: filteredConversations.filter(
		({ lastActivityAt }) => lastActivityAt.getTime() > dateRanges[2] && lastActivityAt.getTime() < dateRanges[1]
		),
		older: filteredConversations.filter(({ lastActivityAt }) => lastActivityAt.getTime() < dateRanges[2]),
	};
</script>


<div
	class="scrollbar-custom flex flex-col gap-1 overflow-y-auto rounded-r-xl from-gray-50 px-3 pb-3 pt-2 text-[.9rem] max-sm:bg-gradient-to-t md:bg-gradient-to-l dark:from-gray-800/30 min-h-[73vh]"
>
	<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 mt-1">My Questions</h3>
	{#each Object.entries(groupedConversations) as [group, convs]}
		{#if convs.length}
			<h4 class="mb-1.5 mt-4 pl-0.5 text-sm text-gray-400 first:mt-0 dark:text-gray-500">
				{titles[group]}
			</h4>
			{#each convs as conv}
				<NavConversationItem on:editConversationTitle on:deleteConversation on:shareConversation on:unshareConversation {conv} />
			{/each}
		{/if}
	{/each}
</div>
<div
	class="mt-0.5 flex flex-col gap-1 rounded-r-xl p-3 text-sm md:bg-gradient-to-l md:from-gray-50 md:dark:from-gray-800/30"
>
	{#if user?.username || user?.email}
		<form
			action="{base}/logout"
			method="post"
			class="group flex items-center gap-1.5 rounded-lg pl-2.5 pr-2 hover:bg-gray-100 dark:hover:bg-gray-700"
		>
			<span
				class="flex h-9 flex-none shrink items-center gap-1.5 truncate pr-2 text-gray-500 dark:text-gray-400"
				>{user?.username || user?.email}</span
			>
			{#if !user.logoutDisabled}
				<button
					type="submit"
					class="ml-auto h-6 flex-none items-center gap-1.5 rounded-md border bg-white px-2 text-gray-700 shadow-sm group-hover:flex hover:shadow-none md:hidden dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
				>
					Sign Out
				</button>
			{/if}
		</form>
	{/if}
	{#if canLogin}
		<form action="{base}/login" method="POST" target="_parent">
			<button
				type="submit"
				class="flex h-9 w-full flex-none items-center gap-1.5 rounded-lg pl-2.5 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
			>
				Login
			</button>
		</form>
	{/if}
	<button
		on:click={switchTheme}
		type="button"
		class="flex h-9 flex-none items-center gap-1.5 rounded-lg pl-2.5 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
	>
		Theme
	</button>
	{#if nModels > 1}
		<a
			href="{base}/models"
			class="flex h-9 flex-none items-center gap-1.5 rounded-lg pl-2.5 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
		>
			Models
			<span
				class="ml-auto rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-500 dark:border-gray-500 dark:text-gray-400"
				>{nModels}</span
			>
		</a>
	{/if}
	{#if $page.data.enableAssistants}
		<a
			href="{base}/assistants"
			class="flex h-9 flex-none items-center gap-1.5 rounded-lg pl-2.5 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
		>
			Assistants
			<span
				class="ml-auto rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-500 dark:border-gray-500 dark:text-gray-400"
				>New</span
			>
		</a>
	{/if}

	<a
		href="{base}/settings"
		class="flex h-9 flex-none items-center gap-1.5 rounded-lg pl-2.5 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
	>
		Settings
	</a>
	{#if envPublic.PUBLIC_APP_NAME === "HuggingChat"}
		<a
			href="{base}/privacy"
			class="flex h-9 flex-none items-center gap-1.5 rounded-lg pl-2.5 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
		>
			About & Privacy
		</a>
	{/if}
</div>
