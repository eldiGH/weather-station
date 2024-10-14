<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Icon from './Icon.svelte';
	import Button from './Button.svelte';

	interface Props
		extends ComponentProps<Icon>,
			Pick<ComponentProps<Button>, 'onclick' | 'disabled'> {
		size?: number;
		iconSize?: number;
		disabled?: boolean;
	}

	const { size = 16, iconSize, onclick, disabled, ...restProps }: Props = $props();
</script>

<div class="icon-button">
	<Button {disabled} style="width: {size * 2}px; height: {size * 2}px;" {onclick}>
		<Icon size={iconSize ?? size} {...restProps} />
	</Button>
</div>

<style lang="scss">
	.icon-button {
		:global(.btn) {
			border-radius: 50%;
			padding: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			overflow: hidden;
		}
	}
</style>
