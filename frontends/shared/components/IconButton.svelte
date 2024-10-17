<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Icon, { type IconVariant } from './Icon.svelte';
	import Button from './Button.svelte';

	interface Props
		extends Omit<ComponentProps<typeof Button>, 'icon'>,
			Omit<ComponentProps<Icon>, 'variant'> {
		size?: number;
		iconSize?: number;
		square?: boolean;
		iconVariant?: IconVariant;
	}

	const {
		size = 16,
		iconSize,
		icon,
		disabled,
		square,
		href,
		iconVariant,
		filled,
		grade,
		opticalSize,
		weight,
		...restProps
	}: Props = $props();
</script>

<div class="icon-button" class:round={!square}>
	<Button {...restProps} style="width: {size * 2}px; height: {size * 2}px;">
		<Icon
			{icon}
			variant={iconVariant}
			size={iconSize ?? size}
			{filled}
			{grade}
			{opticalSize}
			{weight} />
	</Button>
</div>

<style lang="scss">
	.icon-button {
		:global(.btn) {
			padding: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			overflow: hidden;
		}

		&.round {
			:global(.btn) {
				border-radius: 50%;
			}
		}
	}
</style>
