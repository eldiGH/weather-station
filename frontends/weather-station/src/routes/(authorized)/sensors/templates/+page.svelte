<script lang="ts">
	import { Button, Container, DataGrid, type DataGridColumn } from '@shared/ui/components';
	import type { AppRouterOutputs } from 'backend/trpc';
	import type { ExtractResponseDataType } from 'backend/types';
	import type { PageData } from './$types';
	import AddSensorTemplateDialog from '$lib/components/AddSensorTemplateDialog.svelte';

	type SensorTemplate = ExtractResponseDataType<
		AppRouterOutputs['sensor']['getSensorTemplates']
	>[number];

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { sensorTemplates } = $derived(data);

	let openAddSensorTemplateDialog: undefined | (() => void) = $state();

	const columns: DataGridColumn<SensorTemplate>[] = [
		{ dataKey: 'id', label: 'ID' },
		{ dataKey: 'name', label: 'Nazwa' }
	];
</script>

<Container pt={3}>
	<div>
		<Button icon="add" onclick={openAddSensorTemplateDialog}>Dodaj szablon czujnika</Button>
		<DataGrid {columns} data={$sensorTemplates} />
	</div>
</Container>

<AddSensorTemplateDialog bind:open={openAddSensorTemplateDialog} />

<style lang="scss">
	div {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: start;
		gap: 2rem;
	}
</style>
