<script lang="ts" module>
	const INPUT_REGEX = /^-$|^-?0[.,]\d*$|^-?0[.,]?$|^-?[1-9]\d*[,.]?\d*$|^$/;
</script>

<script lang="ts">
	import { untrack, type ComponentProps } from 'svelte';
	import Input from './Input.svelte';
	import type { FormEventHandler } from 'svelte/elements';
	import IconButton from './IconButton.svelte';

	type Props = Omit<ComponentProps<typeof Input>, 'value' | 'diabled'> & {
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
				value = 0;
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
</script>

<div class="root">
	{#if decButton}
		<IconButton {disabled} onclick={handleDecrement} icon="remove" />
	{/if}
	<Input
		{...inputProps}
		{disabled}
		bind:value={inputValue}
		oninput={handleInput}
		onfocus={handleFocus} />
	{#if incButton}
		<IconButton {disabled} onclick={handleIncrement} icon="add" />
	{/if}
</div>

<style lang="scss">
	.root {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
