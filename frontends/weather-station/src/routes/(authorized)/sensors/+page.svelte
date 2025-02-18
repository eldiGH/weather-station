<script lang="ts">
	import AddEditSensorDialog from '$lib/components/AddEditSensorDialog.svelte';
	import { Button, Container, DataGrid, IconButton } from '@shared/ui/components';
	import type { PageData } from './$types';
	import type { CreateSensorInput, EditSensorInput } from 'backend/schemas';
	import { trpcAuthed } from '@shared/ui/api';
	import { dataGridColumns } from '@shared/ui/types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { sensorTemplates, sensors } = $derived(data);

	const tableSensors = $derived(
		sensors.map(({ id, name, lastData, templateId }) => ({
			id,
			name,
			lastDataDate: lastData?.createdAt,
			templateName: templateId ? sensorTemplates.getById(templateId)?.name : undefined
		}))
	);

	const columns = dataGridColumns([] as typeof tableSensors, (col) => [
		col({ dataKey: 'id', label: 'ID' }),
		col({ dataKey: 'name', label: 'Nazwa' }),
		col({ dataKey: 'templateName', label: 'Szablon' }),
		col({ dataKey: 'lastDataDate', label: 'Ostatni odczyt' }),
		col({
			dataKey: 'id',
			label: 'Akcje',
			sortable: false,
			snippet: ActionButtons,
			resizable: false
		})
	]);

	let openAddEditSensorDialog: undefined | (() => void) = $state();

	const handleAddSensor = async (data: CreateSensorInput) => {
		const { error } = await trpcAuthed(fetch).sensor.createSensor.mutate(data);

		return Boolean(error);
	};

	const handleEditSensor = async (data: EditSensorInput) => {
		const { error } = await trpcAuthed(fetch).sensor.editSensor.mutate(data);

		return Boolean(error);
	};

	let selectedSensor: null | (typeof sensors)[number] = $state(null);

	const editSensor = (sensorId: number) => {
		const sensor = sensors.find((s) => s.id === sensorId);

		if (!sensor) {
			return;
		}

		selectedSensor = sensor;
		console.log({ sensor });
		openAddEditSensorDialog?.();
	};

	const deleteSensor = (sensorId: number) => {
		const sensor = sensors.find((s) => s.id === sensorId);
		if (!sensor) {
			return;
		}

		selectedSensor = sensor;
	};
</script>

{#snippet ActionButtons(sensorId: number)}
	<div class="actions">
		<IconButton icon="edit" onclick={() => editSensor(sensorId)} />
		<IconButton icon="delete" variant="danger" onclick={() => deleteSensor(sensorId)} />
	</div>
{/snippet}

<Container pt={3}>
	<div class="root">
		<Button icon="add" onclick={openAddEditSensorDialog}>Dodaj czujnik</Button>
		<DataGrid {columns} data={tableSensors} />
	</div>
</Container>

<AddEditSensorDialog
	bind:open={openAddEditSensorDialog}
	sensorTemplates={$sensorTemplates}
	onAdd={handleAddSensor}
	onEdit={handleEditSensor}
	editSensor={selectedSensor} />

<style lang="scss">
	.root {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: start;
		gap: 2rem;

		.actions {
			display: flex;
			gap: 0.5rem;
		}
	}
</style>
