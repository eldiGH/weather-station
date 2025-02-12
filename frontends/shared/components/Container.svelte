<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		pt?: number;
		pb?: number;
		children?: Snippet;
	}

	const { pt, pb, children }: Props = $props();
</script>

<div
	style:padding-top={pt ? `${pt}rem` : 'inherit'}
	style:padding-bottom={pb ? `${pb}rem` : 'inherit'}
	class="container__root">
	<div class="container">{@render children?.()}</div>
</div>

<style lang="scss">
	.container {
		width: min(1024px, 100%);
		min-height: 100%;
		display: flex;
		flex-direction: column;

		&__root {
			min-height: 100%;
			width: 100%;
			display: flex;
			justify-content: center;
		}
	}
</style>
