<script lang="ts">
	import AddSensorDialog from '$lib/components/AddSensorDialog.svelte';
	import { Button, Container, DataGrid } from '@shared/ui/components';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { sensorTemplates } = $derived(data);

	let openAddSensorDialog: undefined | (() => void) = $state();
</script>

<Container pt={3}>
	<div>
		<Button icon="add" onclick={openAddSensorDialog}>Test</Button>
		<DataGrid {columns} data={$sensors} />
	</div>
</Container>

<AddSensorDialog bind:open={openAddSensorDialog} sensorTemplates={$sensorTemplates} />
