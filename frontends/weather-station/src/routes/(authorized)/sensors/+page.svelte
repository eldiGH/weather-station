<script lang="ts">
	import AddSensorDialog from '$lib/components/AddSensorDialog.svelte';
	import AddSensorTemplateDialog from '$lib/components/AddSensorTemplateDialog.svelte';
	import { Button, Checkbox } from '@shared/ui/components';

	let openAddSensorDialog: undefined | (() => void) = $state();
	let openAddSensorTemplateDialog: undefined | (() => void) = $state();
</script>

<Button icon="add" onclick={openAddSensorDialog}>Test</Button>
<Button icon="add" onclick={openAddSensorTemplateDialog}>Dodaj szablon czujnika</Button>

<AddSensorDialog bind:open={openAddSensorDialog} />
<AddSensorTemplateDialog bind:open={openAddSensorTemplateDialog} />

<Checkbox />
