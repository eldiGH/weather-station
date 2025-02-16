<script lang="ts">
	import AddSensorDialog from '$lib/components/AddEditSensorDialog.svelte';
	import { Button, Container, DataGrid } from '@shared/ui/components';
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
		sensors.map(({ id, name, lastData, sensorTemplateId }) => ({
			id,
			name,
			lastDataDate: lastData?.createdAt,
			templateName: sensorTemplateId ? sensorTemplates.getById(sensorTemplateId)?.name : undefined
		}))
	);

	const columns = dataGridColumns([] as typeof tableSensors, (col) => [
		col({ dataKey: 'id', label: 'ID' }),
		col({ dataKey: 'name', label: 'Nazwa' }),
		col({ dataKey: 'templateName', label: 'Szablon' }),
		col({ dataKey: 'lastDataDate', label: 'Ostatni odczyt' }),
		col({ dataKey: 'id', label: 'Akcje', sortable: false, snippet: ActionButtons })
	]);

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

{#snippet ActionButtons(sensorId: number, sensor: (typeof tableSensors)[number])}
	<Button>Edit</Button>
	<Button>Delete</Button>
{/snippet}

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
