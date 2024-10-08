<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Ripple, { type ShowRippleFn } from './Ripple.svelte';
	import Spinner from 'frontend.shared/components/Spinner';

	interface $$Props extends HTMLButtonAttributes {
		busy?: boolean;
		ripple?: boolean;
		style?: string;
	}

	export let busy = false;
	export let disabled: boolean | null = false;
	export let ripple = true;
	export let style: string = '';

	let showRipple: ShowRippleFn;
</script>

<button
	{...$$restProps}
	class="btn"
	{style}
	on:click
	on:click={ripple ? showRipple : undefined}
	class:busy
	disabled={busy || disabled}>
	<div class="content"><slot /></div>
	{#if busy}
		<div class="spinner">
			<Spinner size={32} />
		</div>
	{/if}
	<Ripple bind:showRipple />
</button>

<style lang="scss">
	.btn {
		background-color: var(--primary-color);
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
			background-color: var(--button-disabled);

			&:hover {
				filter: none;
			}
		}

		.spinner {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);

			display: flex;
			align-items: center;
		}

		.content {
			display: flex;
			align-items: center;
		}

		&.busy {
			.content {
				visibility: hidden;
			}
		}
	}
</style>
