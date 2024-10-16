<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Icon from './Icon.svelte';
	import Button from './Button.svelte';

	interface Props
		extends ComponentProps<Icon>,
			Pick<ComponentProps<typeof Button>, 'onclick' | 'disabled'> {
		size?: number;
		iconSize?: number;
		disabled?: boolean;
		square?: boolean;
	}

	const { size = 16, iconSize, onclick, disabled, square, ...restProps }: Props = $props();
</script>

<div class="icon-button" class:round={!square}>
	<Button {disabled} style="width: {size * 2}px; height: {size * 2}px;" {onclick}>
		<Icon size={iconSize ?? size} {...restProps} />
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
