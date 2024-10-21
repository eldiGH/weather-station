<svelte:options runes />

<script lang="ts">
	import type { ComponentProps, Snippet } from 'svelte';
	import Dialog from './Dialog.svelte';
	import Button from './Button.svelte';

	interface Props extends ComponentProps<typeof Dialog> {
		open?: () => void;
		close?: () => void;
		title?: string;
		children?: Snippet;
		textContent?: string;
		onConfirm?: () => boolean | Promise<boolean>;
		disableCloseButtons?: boolean;
		confirmButtonLabel?: string;
		confirmButtonDisable?: boolean;
		confirmButton?: Snippet<[() => void, boolean]>;
	}

	let {
		open = $bindable(),
		close = $bindable(),
		onConfirm,
		variant = 'danger',
		disableCloseButtons,
		confirmButtonLabel = 'Tak',
		confirmButtonDisable,
		confirmButton,
		closeButtonLabel = 'Nie',
		...restProps
	}: Props = $props();

	let isBusy = $state(false);

	const handleConfirm = async () => {
		if (!onConfirm) {
			close?.();
			return;
		}

		isBusy = true;
		const success = await onConfirm?.();
		if (success) {
			close?.();
		}
		isBusy = false;
	};
</script>

{#snippet footer()}
	{#if confirmButton}
		{@render confirmButton(handleConfirm, isBusy)}
	{:else}
		<Button busy={isBusy} disabled={confirmButtonDisable} onclick={handleConfirm}
			>{confirmButtonLabel}</Button>
	{/if}
{/snippet}

<Dialog
	{...restProps}
	{variant}
	{closeButtonLabel}
	disableCloseButtons={disableCloseButtons || isBusy}
	bind:open
	bind:close
	{footer}></Dialog>
