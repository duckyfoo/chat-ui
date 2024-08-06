<script lang="ts">
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";
	import { page } from "$app/stores";
	import { env as envPublic } from "$env/dynamic/public";
	import QuestionList from "$lib/components/QuestionList.svelte";
	import { ERROR_MESSAGES, error } from "$lib/stores/errors";
	import { pendingMessage } from "$lib/stores/pendingMessage";
	import { useSettingsStore } from "$lib/stores/settings.js";
	import { findCurrentModel } from "$lib/utils/models";
	import { onMount } from "svelte";

	export let data;
	let loading = false;
	let files: File[] = [];

	const settings = useSettingsStore();


</script>

<svelte:head>
	<title>{envPublic.PUBLIC_APP_NAME}</title>
</svelte:head>

<QuestionList
	publicConversations={$page.data.publicConversations}
	user={$page.data.user}
/>
