<script lang="ts">
	import { FormDialog, Input } from '@shared/ui/components';
	import { createForm } from '@shared/ui/stores';
	import { createSensorInputSchema } from 'backend/schemas';

	interface Props {
		open?: () => void;
	}

	let { open = $bindable() }: Props = $props();

	const form = createForm(
		{ name: '', templateId: undefined },
		{ schema: createSensorInputSchema, shouldInitialBeValid: false }
	);

	const { values } = $derived(form);
</script>

<FormDialog {form} bind:open title="Dodaj czujnik">
	<Input label="Nazwa" bind:value={$values.name} />
</FormDialog>
