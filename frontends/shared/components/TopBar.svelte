<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		left?: Snippet;
		center?: Snippet;
		right?: Snippet;
		class?: string;
	}

	const { center, left, right, class: className }: Props = $props();
</script>

<div class={`top-bar ${className}`}>
	<div class="left-slot">{@render left?.()}</div>
	<div class="center-slot">{@render center?.()}</div>
	<div class="right-slot">{@render right?.()}</div>
</div>

<style lang="scss">
	@use '../styles/vars' as v;

	.top-bar {
		width: 100%;
		background-color: var(--top-bar-background);
		height: v.$topBarHeight;
		position: sticky;
		top: 0;
		box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
		padding: 0.5rem 1rem 0.5rem 0.5rem;
		display: flex;
		z-index: 1000;
		color: var(--top-bar-text-color);

		> div {
			flex-grow: 1;
			display: flex;
			align-items: center;

			&.left-slot {
				justify-content: flex-start;
			}

			&.center-slot {
				justify-content: center;
			}

			&.right-slot {
				justify-content: flex-end;
			}
		}

		:global(.header) {
			font-size: 1.3rem;
		}
	}
</style>
