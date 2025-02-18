<script lang="ts">
	import { FormDialog, Input, Select } from '@shared/ui/components';
	import { createForm } from '@shared/ui/stores';
	import type { SelectOption } from '@shared/ui/types';
	import {
		createSensorInputSchema,
		type CreateSensorInput,
		type EditSensorInput
	} from 'backend/schemas';
	import type { AppRouterOutputs } from 'backend/trpc';
	import type { ExtractResponseDataType } from 'backend/types';

	interface Props {
		open?: () => void;
		sensorTemplates: ExtractResponseDataType<AppRouterOutputs['sensor']['getSensorTemplates']>;
		// TODO: Remove this complex type when templateId is not nullable
		editSensor?: (Omit<EditSensorInput, 'templateId'> & { templateId: number | null }) | null;
		onAdd: (data: CreateSensorInput) => Promise<boolean>;
		onEdit: (data: EditSensorInput) => Promise<boolean>;
	}

	let { open = $bindable(), sensorTemplates, editSensor, onAdd, onEdit }: Props = $props();

	const sensorTemplateSelectOptions: SelectOption[] = $derived(
		sensorTemplates.map((template) => ({
			value: template.id,
			label: template.name
		}))
	);

	const form = $derived(
		createForm(
			editSensor
				? { name: editSensor.name, templateId: editSensor.templateId }
				: { name: '', templateId: null },
			{ schema: createSensorInputSchema, shouldInitialBeValid: false }
		)
	);

	const handleEdit = async (data: CreateSensorInput) => {
		if (!editSensor) {
			return false;
		}

		return await onEdit({ ...data, id: editSensor.id });
	};

	const { values } = $derived(form);
</script>

<FormDialog
	{form}
	bind:open
	title={editSensor ? 'Edytuj czujnik' : 'Dodaj czujnik'}
	submitButtonLabel={editSensor ? 'Zapisz' : 'Dodaj'}
	onSubmit={editSensor ? handleEdit : onAdd}>
	<Input required label="Nazwa" bind:value={$values.name} />
	<Select
		required
		label="Szablon czujnika"
		options={sensorTemplateSelectOptions}
		bind:value={$values.templateId} />
</FormDialog>
