<script lang="ts">
	import { base } from "$app/paths";
	import { page } from "$app/stores";

	import type { ConvSidebar } from "$lib/types/ConvSidebar";


	export let conv: ConvSidebar;


</script>

<a
	data-sveltekit-noscroll
	href="{base}/conversation/{conv.id}"
	class="group flex flex-none items-center gap-1.5 rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 {conv.id ===
	$page.params.id
		? 'bg-gray-100 dark:bg-gray-700'
		: ''}"
>
	<div class="w-full p-2 bg-white rounded">
		<div class="flex flex-col">
			<div class="flex justify-between items-center">
				<p class="text-sm text-gray-600 font-semibold">{conv.title}</p>
				<p class="text-xs text-gray-500">
					{conv.commentCount} comment{conv.commentCount !== 1 ? 's' : ''}
					{#if (conv.commentThreadCount ?? 0) > 0}
						in {conv.commentThreadCount} thread{conv.commentThreadCount !== 1 ? 's' : ''}
					{/if}
					· 
					{new Date(conv.lastActivityAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
				</p>
			</div>
			<p>{conv.excerpt}</p>

		</div>
	</div>
</a>
