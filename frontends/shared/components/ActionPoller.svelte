<script lang="ts" context="module">
	const actionPoller = createActionPoller();

	export const { subscribeAction, registerActivityChangeHandler } = actionPoller;
</script>

<script lang="ts">
	import { createActionPoller } from '../helpers/actionPoller';
	import { onDestroy, onMount } from 'svelte';

	onMount(() => {
		actionPoller.onMount();
	});

	onDestroy(() => {
		actionPoller.onDestroy();
	});
</script>
