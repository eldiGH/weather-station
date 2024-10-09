<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Icon from './Icon.svelte';
	import Button from '@shared/components/Button.svelte';

	interface $$Props extends ComponentProps<Icon> {
		size?: number;
	}

	$: restProps = $$restProps as $$Props;

	export let size = 16;
</script>

<div class="icon-button">
	<Button style="width: {size * 2}px; height: {size * 2}px;" on:click>
		<Icon {size} {...restProps} />
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
