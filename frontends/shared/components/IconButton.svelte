<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Icon from './Icon.svelte';
	import Button from './Button.svelte';
	import { fade as fadeAnimation } from 'svelte/transition';
	import type { IconVariant } from '../types/Icon';

	interface Props
		extends Omit<ComponentProps<typeof Button>, 'icon'>,
			Omit<ComponentProps<typeof Icon>, 'variant'> {
		size?: number;
		iconSize?: number;
		square?: boolean;
		iconVariant?: IconVariant;
		fade?: boolean;
		floating?: { top?: string; bottom?: string; left?: string; right?: string };
		onTop?: boolean;
	}

	const {
		size = 16,
		iconSize,
		icon,
		square,
		iconVariant,
		filled,
		grade,
		opticalSize,
		weight,
		fade,
		floating,
		onTop,
		...restProps
	}: Props = $props();

	const a: typeof fadeAnimation = (node: Element) => {
		if (!fade) {
			return {};
		}

		return fadeAnimation(node, { duration: 150 });
	};
</script>

<div
	transition:a
	class="icon-button"
	class:on-top={onTop}
	class:floating
	class:round={!square}
	style:top={floating?.top}
	style:bottom={floating?.bottom}
	style:left={floating?.left}
	style:right={floating?.right}>
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
	@use '@shared/ui/styles/vars' as v;

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

		&.floating {
			position: fixed;
		}

		&.on-top {
			z-index: v.$loaderZIndex;
		}
	}
</style>
