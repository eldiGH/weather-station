<script lang="ts">
	import { Card } from 'agnostic-svelte';
	import type { SensorResponseWithCurrentData } from 'shared';
	import IconInfo from './IconInfo.svelte';
	import Link from './Link.svelte';
	import { page } from '$app/stores';
	import { formatCreatedAt } from '$lib/helpers/date';
	import TempAndHumidityGauge from './TempAndHumidityGauge.svelte';
	import BatteryIndicator from './BatteryIndicator.svelte';

	export let sensor: SensorResponseWithCurrentData;
</script>

<Link noColor href={`${$page.url.pathname}/${sensor.id}`}>
	<div class="root">
		<Card isBorder isRounded isShadow>
			<div class="card-content">
				<div class="header">
					<div>
						{sensor.name}
					</div>
					{#if sensor.currentData}
						<div class="time">
							<IconInfo gap={0.3} icon="schedule"
								>{formatCreatedAt(sensor.currentData.createdAt)}</IconInfo>
						</div>
					{/if}
				</div>
				<div class="gauges">
					{#if sensor.currentData}
						<TempAndHumidityGauge
							temperature={sensor.currentData.temperature}
							humidity={sensor.currentData.humidity} />
						<BatteryIndicator batteryPercentage={sensor.currentData.batteryPercentage} />
					{:else}
						BRAK DANYCH
					{/if}
				</div>
			</div>
		</Card>
	</div>
</Link>

<style lang="scss">
	.root {
		font-size: 1.5rem;
		width: 20rem;

		.card-content {
			width: 100%;
			padding: 0.5rem 1.5rem;

			.header {
				font-size: 2rem;
				margin-bottom: 0.5rem;
				text-align: center;

				.time {
					font-size: 1.3rem;
					opacity: 0.7;
				}
			}

			.gauges {
				display: flex;
				align-items: center;
				flex-direction: column;
			}
		}
	}
</style>
