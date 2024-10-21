<script lang="ts">
	import { untrack, type ComponentProps } from 'svelte';
	import Input from './Input.svelte';
	import type { FormEventHandler } from 'svelte/elements';
	import IconButton from './IconButton.svelte';

	const INPUT_REGEX = /^-$|^-?0[.,]\d*$|^-?0[.,]?$|^-?[1-9]\d*[,.]?\d*$|^$/;

	type Props = Omit<ComponentProps<typeof Input>, 'value' | 'disabled'> & {
		value?: number | undefined;
		min?: number;
		max?: number;
		incButton?: boolean;
		decButton?: boolean;
		disabled?: boolean;
	};

	let {
		value = $bindable(undefined),
		oninput,
		incButton,
		decButton,
		min,
		max,
		disabled,
		short,
		...inputProps
	}: Props = $props();
	let inputValue = $state('');
	let lastValidValue = '';
	let wasUpdateScheduled = false;

	$effect(() => {
		if (value !== undefined && !wasUpdateScheduled) {
			let newValue = value;

			if (max !== undefined && value > max) {
				newValue = max;
			} else if (min !== undefined && value < min) {
				newValue = min;
			}

			const stringValue = newValue?.toString() ?? '';
			inputValue = stringValue;
			lastValidValue = stringValue;

			if (newValue !== value) {
				value = newValue;
				return;
			}
		}

		if (wasUpdateScheduled) {
			wasUpdateScheduled = false;
		}
	});

	const handleInput: FormEventHandler<HTMLInputElement> = (e) => {
		untrack(() => {
			const targetValue = e.currentTarget.value;

			if (!INPUT_REGEX.test(targetValue)) {
				inputValue = lastValidValue;
				return;
			}

			const parsedValue = parseFloat(targetValue);

			if (targetValue === '') {
				wasUpdateScheduled = true;
				value = undefined;
			} else if (!isNaN(parsedValue)) {
				wasUpdateScheduled = true;
				if (max !== undefined && parsedValue > max) {
					value = max;
					inputValue = max.toString();
				} else if (min !== undefined && parsedValue < min) {
					value = min;
					inputValue = min.toString();
				} else {
					value = parsedValue;
				}
			}

			lastValidValue = targetValue;
		});
	};

	const handleIncrement = () => {
		if (value === undefined) {
			value = 1;
			return;
		}

		if (max !== undefined && value >= max) {
			return;
		}

		value++;
	};

	const handleDecrement = () => {
		if (value === undefined) {
			value = -1;
			return;
		}

		if (min !== undefined && value <= min) {
			return;
		}

		value--;
	};

	const handleFocus: FormEventHandler<HTMLInputElement> = (e) => {
		e.currentTarget.select();
	};

	const incDecButtonSize = 20;

	let incDecButtonsWidth = $derived(
		((incButton ? incDecButtonSize : 0) + (decButton ? incDecButtonSize : 0)) * 2
	);

	let incDecGapsCount = $derived((incButton ? 1 : 0) + (decButton ? 1 : 0));
</script>

<div class="root">
	{#if decButton}
		<IconButton
			type="button"
			size={incDecButtonSize}
			iconSize={25}
			{disabled}
			onclick={handleDecrement}
			icon="remove" />
	{/if}
	<div
		class="numeric-input-container"
		class:short
		style:--inc-dec-buttons-width={`${incDecButtonsWidth}px`}
		style:--gaps-count={incDecGapsCount}>
		<Input
			inputmode="numeric"
			{...inputProps}
			{disabled}
			bind:value={inputValue}
			oninput={handleInput}
			onfocus={handleFocus} />
	</div>
	{#if incButton}
		<IconButton
			type="button"
			size={incDecButtonSize}
			iconSize={25}
			{disabled}
			onclick={handleIncrement}
			icon="add" />
	{/if}
</div>

<style lang="scss">
	@use '../styles/vars.scss' as v;

	.root {
		--inc-dev-gap: 0.5rem;

		display: inline-flex;
		align-items: center;
		gap: var(--inc-dev-gap);

		.numeric-input-container {
			width: calc(
				v.$inputWidth - var(--inc-dec-buttons-width, 0) -
					(var(--inc-dev-gap) * var(--gaps-count, 0))
			);

			&.short {
				width: v.$inputShortWidth;
			}
		}
	}
</style>
