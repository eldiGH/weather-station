<script lang="ts">
	import { createForm } from '@shared/ui/stores';
	import { createSensorTemplateSchema } from 'backend/schemas';
	import FormDialog from '../../../../shared/components/FormDialog.svelte';
	import { Button, Input } from '@shared/ui/components';

	interface Props {
		open?: () => void;
	}

	let { open = $bindable() }: Props = $props();

	const form = createForm(
		{
			fields: [{ isOptional: false, propertyName: '', type: 'integer' }],
			name: '',
			isPublic: false
		},
		{ schema: createSensorTemplateSchema, shouldInitialBeValid: false }
	);

	const { values } = $derived(form);

	const addProperty = () => {
		values.update((values) => ({
			...values,
			fields: [...values.fields, { isOptional: false, propertyName: '', type: 'integer' }]
		}));
	};

	let checked = false;

	$inspect($values);
</script>

<FormDialog {form} bind:open title="Dodaj szablon czujnika">
	<Input label="Nazwa" bind:value={$values.name} />

	{#each $values.fields as field, i}
		<div class="property-container">
			<Input label="Nazwa właściwości" bind:value={$values.fields[i].propertyName} />
		</div>
	{/each}

	<Button icon="add" onclick={addProperty}>Dodaj właściwość</Button>
</FormDialog>

<style lang="scss">
	.property-container {
		display: flex;
		align-items: center;
		gap: 1rem;
		border: 1px dashed gray;
		border-radius: 5px;
		padding: 1rem;
		width: 100%;
	}
</style>
