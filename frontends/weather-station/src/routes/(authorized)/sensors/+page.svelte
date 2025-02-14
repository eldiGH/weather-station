<script lang="ts">
	import AddSensorDialog from '$lib/components/AddSensorDialog.svelte';
	import { Button, Container, DataGrid, type DataGridColumn } from '@shared/ui/components';
	import type { PageData } from './$types';

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
		{ dataKey: 'lastDataDate', label: 'Ostatni odczyt' },
		{ dataKey: 'test', label: 'TEST' }
	];

	let openAddSensorDialog: undefined | (() => void) = $state();
</script>

<Container pt={3}>
	<div>
		<Button icon="add" onclick={openAddSensorDialog}>Dodaj czujnik</Button>
		<DataGrid {columns} data={tableSensors.map((s) => ({ ...s, test: 1000000000000000 }))} />
	</div>
</Container>

<AddSensorDialog bind:open={openAddSensorDialog} sensorTemplates={$sensorTemplates} />

<style lang="scss">
	div {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: start;
		gap: 2rem;
	}
</style>
