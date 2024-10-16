<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	interface Props {
		class?: string;
		ref?: HTMLAnchorElement | HTMLElement;
		noColor?: boolean;
		href: string;
		children: Snippet;
		button?: boolean;
		onclick?: MouseEventHandler<HTMLAnchorElement>;
	}

	let {
		children,
		href,
		class: className,
		noColor = false,
		ref = $bindable(),
		onclick,
		button
	}: Props = $props();
</script>

<a
	bind:this={ref}
	{onclick}
	class:color={!noColor}
	class:without-color={noColor}
	class={className}
	class:button
	{href}>
	{@render children()}
</a>

<style lang="scss">
	a,
	a:visited,
	a:hover {
		text-decoration: none;
	}

	.color {
		color: var(--link-color);
		transition: filter 100ms ease-in-out;

		&:hover {
			filter: brightness(70%);
			cursor: pointer;
		}
	}

	.without-color {
		color: inherit;
	}

	.button {
		background-color: var(--primary-color);
		color: var(--button-text-color);
		padding: 1rem 2rem;
		border-radius: 15px;
	}
</style>
