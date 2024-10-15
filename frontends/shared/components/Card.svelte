<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	const { class: className, children }: Props = $props();
</script>

<div class={className}>
	{#if children}
		{@render children()}
	{/if}
</div>

<style lang="scss">
	div {
		display: inline-block;
		border: 1px solid var(--card-border);
		border-radius: 5px;
		box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
		background-color: var(--card-background);
		color: var(--card-text-color);

		--input-text-color: white;
	}
</style>
