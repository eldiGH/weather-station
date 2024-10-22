<script lang="ts">
	import type { ComponentProps, Snippet } from 'svelte';
	import Icon from './Icon.svelte';

	interface Props extends ComponentProps<typeof Icon> {
		class?: string;
		gap?: number;
		color?: string;
		content?: string;
		children?: Snippet;
		height?: string;
	}

	let { class: className, gap, color, content, children, height, ...iconProps }: Props = $props();
</script>

<div
	style={`--gap:${gap ?? 0}rem; ${color !== undefined ? 'color: ' + color : ''}`}
	style:height
	class={className}>
	<Icon {...iconProps} />
	{#if content}
		{content}
	{:else}
		{@render children?.()}
	{/if}
</div>

<style lang="scss">
	div {
		display: inline-flex;
		align-items: center;
		gap: var(--gap);
	}
</style>
