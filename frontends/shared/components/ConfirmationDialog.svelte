<script lang="ts">
	import type { ComponentProps, Snippet } from 'svelte';
	import Dialog from './Dialog.svelte';
	import Button from './Button.svelte';

	interface Props extends ComponentProps<typeof Dialog> {
		show?: boolean;
		title?: string;
		children?: Snippet;
		textContent?: string;
		onConfirm?: () => boolean | Promise<boolean>;
		disableCloseButtons?: boolean;
	}

	let {
		show = $bindable(),
		onConfirm,
		variant = 'danger',
		disableCloseButtons,
		...restProps
	}: Props = $props();

	let isBusy = $state(false);

	const handleConfirm = async () => {
		if (!onConfirm) {
			show = false;
			return;
		}

		isBusy = true;
		show = !(await onConfirm());
		isBusy = false;
	};
</script>

{#snippet footer()}
	<Button busy={isBusy} onclick={handleConfirm}>Tak</Button>
{/snippet}

<Dialog
	{...restProps}
	{variant}
	disableCloseButtons={disableCloseButtons || isBusy}
	closeButtonLabel="Nie"
	bind:show
	{footer}></Dialog>
