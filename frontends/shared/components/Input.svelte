<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { v4 as uuid } from 'uuid';

	interface Props extends HTMLInputAttributes {
		id?: string;
		label?: string;
		value?: string;
		error?: string | false;
	}

	let {
		id = uuid(),
		error = '',
		label = '',
		value = $bindable(''),
		onblur,
		...restProps
	}: Props = $props();
</script>

<div class="container">
	<div class="input__container">
		<input {...restProps} {id} class="input" bind:value />
		{#if label}
			<label for={id} class:raised={!!value}>{label}</label>
		{/if}
		{#if error}
			<span class="error">{error}</span>
		{/if}
	</div>
</div>

<style lang="scss">
	.input {
		$animationOpts: 150ms ease-in-out;
		$raisedTransform: translateY(-1.8rem) scale(0.75);

		background-color: transparent !important;
		border: none;
		border-bottom: 1px solid var(--input-inactive-border);
		padding: 0.5rem 0.5rem;
		transition: border-color $animationOpts;
		font-size: 1rem;

		&:focus {
			outline: none;
			border-color: var(--input-border);

			+ label {
				color: var(--input-border);
				transform: $raisedTransform;
			}
		}

		+ label {
			position: absolute;
			left: 0.4rem;
			top: 50%;
			transform: translateY(-50%);
			pointer-events: none;
			user-select: none;
			transform-origin: left;

			transition:
				color $animationOpts,
				transform $animationOpts;

			color: var(--input-inactive-border);
		}

		+ .raised,
		&:autofill + label {
			transform: $raisedTransform;
		}

		&__container {
			position: relative;
			display: inline-block;
		}

		&:-webkit-autofill,
		&:-webkit-autofill:hover,
		&:-webkit-autofill:focus,
		&:-webkit-autofill:active {
			-webkit-box-shadow: 0 0 50px rgba(255, 255, 255, 0) inset !important;
			background-color: transparent !important;
			background-clip: text;
		}
	}

	.error {
		position: absolute;
		left: 0.4rem;
		top: 105%;
		font-size: 0.8rem;
		color: var(--error);
		max-width: 100%;
	}

	.container {
		padding: 1rem 0;
	}
</style>
