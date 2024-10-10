<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Input from './Input.svelte';
	import type { FormEventHandler } from 'svelte/elements';

	type Props = Omit<ComponentProps<typeof Input>, 'value'> & { value?: number | undefined };

	let { value = $bindable(undefined), oninput, ...inputProps }: Props = $props();
	let inputValue = $state('');

	const handleInput: FormEventHandler<HTMLInputElement> = (e) => {
		const eventValue = e.currentTarget.value;
		const { data } = e as typeof e & { data: string };

		if (eventValue.length === 0) {
			value = undefined;
			return;
		}

		const eventValueAsNumber = parseFloat(eventValue);
		if (isNaN(eventValueAsNumber) || eventValueAsNumber.toString() !== eventValue) {
			inputValue = inputValue.slice(0, -data.length);
			return;
		}

		value = eventValueAsNumber;
	};
</script>

<Input bind:value={inputValue} {...inputProps} oninput={handleInput} />
