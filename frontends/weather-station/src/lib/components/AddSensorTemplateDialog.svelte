<script lang="ts">
	import { createForm } from '@shared/ui/stores';
	import {
		createSensorTemplateFormSchema,
		MAX_SENSORS_FIELDS,
		type CreateSensorTemplateFormInput,
		type SensorTemplateFieldType
	} from 'backend/schemas';
	import { Button, Checkbox, IconButton, Input, FormDialog, Select } from '@shared/ui/components';
	import { slide, scale } from 'svelte/transition';
	import { v4 as uuid } from 'uuid';
	import type { SelectOption } from '@shared/ui/types';
	import { snackbar } from '@shared/ui/helpers';
	import { trpcAuthed } from '@shared/ui/api';

	interface Props {
		open?: () => void;
	}

	let { open = $bindable() }: Props = $props();

	const getEmptyProperty = (): CreateSensorTemplateFormInput['fields'][0] => ({
		isOptional: false,
		propertyName: '',
		type: 'doublePrecision',
		label: null,
		uuid: uuid()
	});

	const form = createForm(
		{
			fields: [getEmptyProperty()],
			name: '',
			isPublic: false
		},
		{ schema: createSensorTemplateFormSchema, shouldInitialBeValid: false }
	);

	const { values } = $derived(form);

	const addProperty = () => {
		if ($values.fields.length >= MAX_SENSORS_FIELDS) {
			return;
		}

		values.update((values) => ({
			...values,
			fields: [...values.fields, getEmptyProperty()]
		}));
	};

	const removeProperty = (uuid: string) => {
		if ($values.fields.length <= 1) {
			return;
		}

		values.update((values) => ({
			...values,
			fields: values.fields.filter((field) => field.uuid !== uuid)
		}));
	};

	const sensorFieldTypeOptions: SelectOption<SensorTemplateFieldType>[] = [
		{ label: 'Liczba całkowita', value: 'integer' },
		{ label: 'L. zmiennoprzecinkowa', value: 'doublePrecision' },
		{ label: 'Tekst', value: 'text' },
		{ label: 'Boolean', value: 'boolean' }
	];

	const submit = async (data: CreateSensorTemplateFormInput) => {
		const { error } = await trpcAuthed(fetch).sensor.createSensorTemplate.mutate({
			...data,
			fields: data.fields.map(({ uuid, ...data }) => data)
		});

		if (error) {
			snackbar.pushError(error.message);
			return false;
		}

		return true;
	};

	$inspect($values);
</script>

<FormDialog
	{form}
	submitButtonLabel="Dodaj"
	onSubmit={submit}
	bind:open
	title="Dodaj szablon czujnika">
	<Input required label="Nazwa szablonu" bind:value={$values.name} />

	<div class="property-group">
		{#each $values.fields as field, i (field.uuid)}
			<div transition:slide class="property-container">
				<div class="property-header">
					Właściwość&nbsp;{i + 1}
					{#if $values.fields.length > 1}
						<div transition:scale>
							<IconButton icon="delete" onclick={() => removeProperty(field.uuid)} />
						</div>
					{/if}
				</div>
				<Input required label="Nazwa właściwości" bind:value={$values.fields[i].propertyName} />
				<Select
					required
					defaultOption={sensorFieldTypeOptions[1]}
					options={sensorFieldTypeOptions}
					bind:value={$values.fields[i].type}
					label="Typ" />
				<Input label="Etykieta" bind:value={$values.fields[i].label} nullWhenEmpty />
				<div class="property-group-checkbox">
					<Checkbox bind:checked={$values.fields[i].isOptional}>Opcjonalna</Checkbox>
				</div>
			</div>
		{/each}
	</div>

	<Button icon="add" disabled={$values.fields.length >= MAX_SENSORS_FIELDS} onclick={addProperty}
		>Dodaj właściwość</Button>
</FormDialog>

<style lang="scss">
	.property {
		&-container {
			display: flex;
			flex-direction: column;
			align-items: baseline;
			gap: 1rem;
			border: 1px dashed gray;
			border-radius: 5px;
			padding: 1rem;
			color: black;
			margin-bottom: 1rem;
		}

		&-header {
			display: flex;
			justify-content: space-between;
			width: 100%;
			align-items: center;
			min-height: 2rem;
		}

		&-group {
			display: flex;
			flex-direction: column;

			&-checkbox {
				padding-top: 1rem;
			}
		}
	}
</style>
