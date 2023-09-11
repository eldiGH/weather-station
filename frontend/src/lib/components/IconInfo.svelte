<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Icon from './Icon.svelte';

	interface $$Props extends ComponentProps<Icon> {
		class?: string | undefined;
		gap?: number | undefined;
	}

	let className: string | undefined = undefined;
	export { className as class };
	export let gap: number | undefined = undefined;

	let iconProps = $$restProps as ComponentProps<Icon>;
</script>

<div style={`--gap:${gap ?? 0}rem`} class={className}>
	<Icon {...iconProps} />
	<slot />
</div>

<style lang="scss">
	div {
		display: flex;
		align-items: center;
		gap: var(--gap);
	}
</style>
