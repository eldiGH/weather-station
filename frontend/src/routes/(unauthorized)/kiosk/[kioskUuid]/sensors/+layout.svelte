<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { trpcWs } from '$lib/api/trpc';

	export let data: LayoutData;

	let unsubscribe: undefined | (() => void) = undefined;

	onMount(() => {
		unsubscribe = trpcWs().kiosk.subscribeKiosk.subscribe(
			{ kioskUuid: data.kioskUuid },
			{
				onData: ({ sensorId, ...sensorData }) => {
					data.kioskDataStore.update((kioskData) => {
						const sensor = kioskData.sensors.find(({ id }) => sensorId === id);

						if (!sensor) {
							return kioskData;
						}

						sensor.currentData = sensorData;
						return { ...kioskData };
					});
				}
			}
		).unsubscribe;
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<slot />
