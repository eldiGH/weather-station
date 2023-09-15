<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Icon from './Icon.svelte';

	interface $$Props extends ComponentProps<Icon> {
		class?: string | undefined;
		gap?: number | undefined;
		color?: string | undefined;
		content?: string | undefined;
	}

	let className: string | undefined = undefined;
	export { className as class };
	export let gap: number | undefined = undefined;
	export let color: string | undefined = undefined;
	export let content: string | undefined = undefined;

	let iconProps = $$restProps as ComponentProps<Icon>;
</script>

<div
	style={`--gap:${gap ?? 0}rem; ${color !== undefined ? 'color: ' + color : ''}`}
	class={className}>
	<Icon {...iconProps} />
	{#if content}
		{content}
	{:else}
		<slot />
	{/if}
</div>

<style lang="scss">
	div {
		display: inline-flex;
		align-items: center;
		gap: var(--gap);
	}
</style>
