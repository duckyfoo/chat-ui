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
			<p class="text-sm text-gray-600 font-semibold">{conv.title}</p>
			<p class="text-xs text-gray-500 mt-1">
				Last Activity: {new Date(conv.lastActivityAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
			</p>
		</div>
	</div>
</a>
