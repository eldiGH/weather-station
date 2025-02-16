<script lang="ts">
	import AddSensorDialog from '$lib/components/AddEditSensorDialog.svelte';
	import { Button, Container, DataGrid, type DataGridColumn } from '@shared/ui/components';
	import type { PageData } from './$types';
	import type { CreateSensorInput, EditSensorInput } from 'backend/schemas';
	import { trpcAuthed } from '@shared/ui/api';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { sensorTemplates, sensors } = $derived(data);

	const tableSensors = $derived(
		sensors.map(({ id, name, lastData, sensorTemplateId }) => ({
			id,
			name,
			lastDataDate: lastData?.createdAt,
			templateName: sensorTemplateId ? sensorTemplates.getById(sensorTemplateId)?.name : undefined
		}))
	);

	const columns: DataGridColumn<(typeof tableSensors)[number]>[] = [
		{ dataKey: 'id', label: 'ID' },
		{ dataKey: 'name', label: 'Nazwa' },
		{ dataKey: 'templateName', label: 'Szablon' },
		{ dataKey: 'lastDataDate', label: 'Ostatni odczyt' }
	];

	let openAddSensorDialog: undefined | (() => void) = $state();

	const handleAddSensor = async (data: CreateSensorInput) => {
		const { error } = await trpcAuthed(fetch).sensor.createSensor.mutate(data);

		return Boolean(error);
	};

	const handleEditSensor = async (data: EditSensorInput) => {
		const { error } = await trpcAuthed(fetch).sensor.editSensor.mutate(data);

		return Boolean(error);
	};
</script>

<Container pt={3}>
	<div>
		<Button icon="add" onclick={openAddSensorDialog}>Dodaj czujnik</Button>
		<DataGrid {columns} data={tableSensors} />
	</div>
</Container>

<AddSensorDialog
	bind:open={openAddSensorDialog}
	sensorTemplates={$sensorTemplates}
	onAdd={handleAddSensor}
	onEdit={handleEditSensor} />

<style lang="scss">
	div {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: start;
		gap: 2rem;
	}
</style>
