<script lang="ts">
	import AddSensorDialog from '$lib/components/AddSensorDialog.svelte';
	import { Button } from '@shared/ui/components';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { sensorTemplates } = $derived(data);

	let openAddSensorDialog: undefined | (() => void) = $state();
</script>

<Button icon="add" onclick={openAddSensorDialog}>Test</Button>

<AddSensorDialog bind:open={openAddSensorDialog} sensorTemplates={$sensorTemplates} />
