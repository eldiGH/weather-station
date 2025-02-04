<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { v4 as uuid } from 'uuid';

	interface Props extends HTMLInputAttributes {
		id?: string;
		label?: string;
		value?: string | null;
		error?: string | false;
		required?: boolean;
		centerText?: boolean;
		short?: boolean;
		inputRef?: HTMLInputElement;
		touched?: boolean;
		fullWidth?: boolean;
		nullWhenEmpty?: boolean;
	}

	let {
		id = uuid(),
		nullWhenEmpty = false,
		error = '',
		label = '',
		value = $bindable(nullWhenEmpty ? null : ''),
		required,
		centerText,
		short,
		inputRef = $bindable(),
		touched = $bindable(),
		fullWidth,
		...restProps
	}: Props = $props();
</script>

<div class="container">
	<div class="input__container">
		<input
			{...restProps}
			{id}
			class="input"
			bind:value={
				() => (value === null ? '' : value),
				(v) => {
					value = nullWhenEmpty && v.length === 0 ? null : v;
				}
			}
			class:center-text={centerText}
			class:short
			class:error
			class:full-width={fullWidth}
			onblur={() => (touched = true)}
			bind:this={inputRef} />
		{#if label}
			<label for={id} class:raised={!!value}
				>{label}
				{#if required}
					<span>*</span>
				{/if}
			</label>
		{/if}
		{#if error}
			<span class="error">{error}</span>
		{/if}
	</div>
</div>

<style lang="scss">
	@use '../styles/vars.scss' as v;

	.input {
		$animationOpts: 150ms ease-in-out;
		$raisedTransform: translateY(-1.1rem) scale(0.75);

		background-color: transparent !important;
		border: none;
		border-bottom: 1px solid var(--input-inactive-border);
		padding: 0.5rem 0.5rem 1px;
		transition: border-color $animationOpts;
		font-size: 1rem;
		color: var(--input-text-color) !important;

		width: 100%;
		max-width: v.$inputWidth;

		touch-action: manipulation;

		&[type='date'] {
			width: v.$inputWidth;
		}

		&.center-text {
			text-align: center;
		}

		&.short {
			max-width: v.$inputShortWidth;
		}

		&.full-width {
			max-width: 100%;
		}

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
			bottom: 1px;
			pointer-events: none;
			user-select: none;
			transform-origin: left;

			transition:
				color $animationOpts,
				transform $animationOpts;

			color: var(--input-inactive-border);

			& span {
				color: var(--input-required-asterisk);
			}
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
			color: var(--input-text-color) !important;
			-webkit-text-fill-color: var(--input-text-color) !important;
		}

		&.error {
			border-color: var(--error);

			+ label {
				color: var(--error);
			}
		}
	}

	span.error {
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
