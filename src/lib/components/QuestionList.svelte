<script lang="ts">

	import { writable } from 'svelte/store'; 
	import PublicConversationItem from "./PublicConversationItem.svelte";
	import type { LayoutData } from "../../routes/$types";
	import type { ConvSidebar } from "$lib/types/ConvSidebar";
	import { page } from "$app/stores";

	export let publicConversations: ConvSidebar[] = [];
	export let user: LayoutData["user"];

	const activeTab = writable('mine');

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
	
	
	$: filteredConversations = publicConversations;
	
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
<div class="relative min-h-0 min-w-0 pl-10">
	<div class="scrollbar-custom mr-1 h-full overflow-y-auto">
		
<!-- Tab switcher -->
<!--
<div class="flex justify-center h-8 mb-2">
    <div class="inline-flex rounded-md border border-gray-200 dark:border-gray-700 h-full">
        <button
            class="px-3 h-full text-sm font-medium rounded-l-md {$activeTab === 'mine' ? 'bg-gray-100 dark:bg-gray-700' : ''}"
            on:click={() => activeTab.set('mine')}
        >
            Mine
        </button>
		<button
			class="px-3 h-full text-sm font-medium rounded-r-md {$activeTab === 'public' ? 'bg-gray-100 dark:bg-gray-700' : ''}"
			on:click={() => activeTab.set('public')}
		>
			Public
		</button>
    </div>
</div>
-->
<div
	class="scrollbar-custom flex flex-col gap-3 overflow-y-auto rounded-r-xl px-3 pb-3 pt-2 text-[.9rem]"
>
	<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 mt-1">All Questions</h3>
	{#each Object.entries(groupedConversations) as [group, convs]}
		{#if convs.length}
			<h4 class="mb-1.5 mt-4 pl-0.5 text-sm text-gray-400 first:mt-0 dark:text-gray-500">
				{titles[group]}
			</h4>
			{#each convs as conv}
				<PublicConversationItem on:editConversationTitle on:deleteConversation on:shareConversation on:unshareConversation {conv} />
			{/each}
		{/if}
	{/each}
</div>

</div>
</div>