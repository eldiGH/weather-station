<script lang="ts">
	import { Button, Spinner } from 'agnostic-svelte';
	import type { ComponentProps } from 'svelte';

	interface $$Props extends ComponentProps<Button> {
		isLoading?: boolean;
		isBusy?: boolean;
	}
</script>

<Button on:click {...$$props} isDisabled={$$props.isDisabled || $$props.isBusy}
	><div class:loading={$$props.isLoading || $$props.isBusy}>
		<span><slot /></span>
		{#if $$props.isLoading || $$props.isBusy}
			<div class="spinner">
				<Spinner />
			</div>
		{/if}
	</div></Button>

<style lang="scss">
	div {
		position: relative;
	}

	.spinner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.loading {
		span {
			visibility: hidden;
		}
	}
</style>
