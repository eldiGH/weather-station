<script lang="ts" generics="T extends Record<string, unknown>">
	import type { ComponentProps } from 'svelte';
	import Dialog from './Dialog.svelte';
	import Button from './Button.svelte';
	import { uuid } from '../helpers/uuid';
	import type { FormSubmit } from '../stores/form';
	import type { Readable } from 'svelte/store';

	interface FormObject<T extends Record<string, unknown> = Record<string, unknown>> {
		isSubmitting: Readable<boolean>;
		isValid: Readable<boolean>;
		reset: () => void;
		submit: FormSubmit<T>;
	}

	interface Props
		extends Pick<
			ComponentProps<typeof Dialog>,
			'title' | 'children' | 'open' | 'close' | 'closeButtonLabel' | 'onClosed'
		> {
		submitButtonLabel?: string;
		onSubmit?: (data: T) => boolean | Promise<boolean>;
		form: FormObject<T>;
	}

	let {
		open = $bindable(),
		close = $bindable(),
		children,
		onSubmit,
		submitButtonLabel = 'Zapisz',
		closeButtonLabel = 'Anuluj',
		form,
		title,
		onClosed
	}: Props = $props();

	const { isSubmitting, isValid, reset, submit } = $derived(form);

	const handleOnClosed = () => {
		reset();
		onClosed?.();
	};

	const id = uuid();

	const handleSubmit = async (data: T) => {
		if (!onSubmit) {
			close?.();
			return;
		}

		const success = await onSubmit(data);
		if (success) {
			close?.();
			return;
		}
	};
</script>

{#snippet submitButton()}
	<Button busy={$isSubmitting} disabled={!$isValid} form={id}>
		{submitButtonLabel}
	</Button>
{/snippet}

<Dialog
	{closeButtonLabel}
	{title}
	onClosed={handleOnClosed}
	footer={submitButton}
	disableCloseButtons={$isSubmitting}
	bind:open
	bind:close>
	<form {id} class="form" onsubmit={submit(handleSubmit)}>
		{@render children?.()}
	</form>
</Dialog>

<style lang="scss">
	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
</style>
