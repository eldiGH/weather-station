<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Spinner from './Spinner.svelte';
	import Ripple, { type ShowRippleFn } from './Ripple.svelte';

	interface $$Props extends HTMLButtonAttributes {
		busy?: boolean;
		ripple?: boolean;
	}

	export let busy = false;
	export let disabled: boolean | null = false;
	export let ripple = true;

	let showRipple: ShowRippleFn;
</script>

<button
	{...$$restProps}
	class="btn"
	on:click
	on:click={ripple ? showRipple : undefined}
	class:busy
	disabled={busy || disabled}>
	<span class="content"><slot /></span>
	{#if busy}
		<div class="spinner">
			<Spinner size={32} thickness={2} />
		</div>
	{/if}
	<Ripple bind:showRipple />
</button>

<style lang="scss">
	@use '../styles/theme.scss' as theme;

	.btn {
		background-color: theme.$primary;
		border: none;
		color: white;
		padding: 0.5em 1em;
		border-radius: 5px;
		font-size: 1.2rem;
		cursor: pointer;
		transition: filter 100ms ease-in-out;
		position: relative;
		user-select: none;

		&:hover {
			filter: brightness(90%);
		}

		&:disabled {
			cursor: not-allowed;
			background-color: theme.$button-disabled;

			&:hover {
				filter: none;
			}
		}

		.spinner {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}

		&.busy {
			.content {
				visibility: hidden;
			}
		}
	}
</style>
