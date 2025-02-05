<script lang="ts">
	import { FormDialog, Input, Select } from '@shared/ui/components';
	import { createForm } from '@shared/ui/stores';
	import type { SelectOption } from '@shared/ui/types';
	import { createSensorInputSchema } from 'backend/schemas';
	import type { AppRouterOutputs } from 'backend/trpc';
	import type { ExtractResponseDataType } from 'backend/types';

	interface Props {
		open?: () => void;
		sensorTemplates: ExtractResponseDataType<AppRouterOutputs['sensor']['getSensorTemplates']>;
	}

	let { open = $bindable(), sensorTemplates }: Props = $props();

	const sensorTemplateSelectOptions: SelectOption[] = sensorTemplates.map((template) => ({
		value: template.id,
		label: template.name
	}));

	const form = createForm(
		{ name: '', templateId: null },
		{ schema: createSensorInputSchema, shouldInitialBeValid: false }
	);

	const { values } = $derived(form);
</script>

<FormDialog {form} bind:open title="Dodaj czujnik">
	<Input required label="Nazwa" bind:value={$values.name} />
	<Select
		required
		label="Szablon czujnika"
		options={sensorTemplateSelectOptions}
		bind:value={$values.templateId} />
</FormDialog>
