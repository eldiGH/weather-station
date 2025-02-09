<script lang="ts">
	import { DataGrid } from '@shared/ui/components';

	const data = [
		{ name: 'Sensor1', lastUpdate: new Date(), template: 'Sensor Template', status: 'Active' },
		{ name: 'Sensor2', lastUpdate: new Date(), template: 'Sensor Template', status: 'Active' },
		{ name: 'Sensor3', lastUpdate: new Date(), template: 'Sensor Template', status: 'Active' },
		{
			name: 'Sensor4',
			lastUpdate: new Date(),
			template: 'Sensor Templatewwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
			status: 'Active'
		},
		{ name: 'Sensor5', lastUpdate: new Date(), template: 'Sensor Template', status: 'Active' },
		{ name: 'Sensor6', lastUpdate: new Date(), template: 'Sensor Template', status: 'Active' },
		{ name: 'Sensor7', lastUpdate: new Date(), template: 'Sensor Template', status: 'Active' },
		{ name: 'Sensor8', lastUpdate: new Date(), template: 'Sensor Template', status: 'Active' },
		{ name: 'Sensor9', lastUpdate: new Date(), template: 'Sensor Template', status: 'Active' },
		{ name: 'Sensor10', lastUpdate: new Date(), template: 'Sensor Template', status: 'Active' }
	];
	const columns = [
		{ label: 'Name', dataKey: 'name' },
		{ label: 'Last Update', dataKey: 'lastUpdate' },
		{ label: 'Template', dataKey: 'template' },
		{ label: 'Status', dataKey: 'status' }
	];
</script>

<DataGrid {columns} {data} />
