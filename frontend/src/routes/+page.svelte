<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>Temperatura: {data.temperature}</div>
<div>Wilgotność: {data.humidity}</div>
<div>Ciśnienie: {data.pressure}</div>
<div>Oporność gazów: {data.gasResistance}</div>
