<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Dialog from './Dialog.svelte';
	import Button from './Button.svelte';
	import { uuid } from '../helpers/uuid';
	import type { FormSubmitEventObject } from '../stores/form';
	import type { Readable } from 'svelte/store';

	interface FormObject {
		isSubmitting: Readable<boolean>;
		isValid: Readable<boolean>;
		reset: () => void;
	}

	interface Props
		extends Pick<
			ComponentProps<typeof Dialog>,
			'title' | 'children' | 'open' | 'close' | 'closeButtonLabel' | 'onClosed'
		> {
		submitButtonLabel?: string;
		onSubmit?: (e: FormSubmitEventObject) => boolean | Promise<boolean>;
		form: FormObject;
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

	const { isSubmitting, isValid, reset } = $derived(form);

	const handleOnClosed = () => {
		reset();
		onClosed?.();
	};

	const id = uuid();

	const handleSubmit = async (e: FormSubmitEventObject) => {
		if (!onSubmit) {
			close?.();
			return;
		}

		const success = await onSubmit(e);
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
	<form {id} class="form" onsubmit={handleSubmit}>
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
