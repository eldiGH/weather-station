<script lang="ts">
	import Card from '@shared/components/Card.svelte';
	import IconInfo from '@shared/components/IconInfo.svelte';
	import Link from '@shared/components/Link.svelte';
	import { page } from '$app/stores';
	import { formatCreatedAt } from '$lib/helpers/date';
	import TempAndHumidityGauge from './TempAndHumidityGauge.svelte';
	import BatteryIndicator from './BatteryIndicator.svelte';
	import PressureCardGauge from './PressureCardGauge.svelte';
	import type { AppRouterOutputs } from 'backend/trpc';

	export let sensor: AppRouterOutputs['kiosk']['getKioskData']['sensors'][0];
</script>

<Link noColor href={`${$page.url.pathname}/${sensor.id}`}>
	<div class="root">
		<Card>
			<div class="card-content">
				<div class="header">
					<div class="sensor-name">
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
						<div class="gauges__item">
							<TempAndHumidityGauge
								temperature={sensor.currentData.temperature}
								humidity={sensor.currentData.humidity} />
						</div>
						<div class="gauges__item">
							<PressureCardGauge pressure={sensor.currentData.pressure / 100} />
							<BatteryIndicator batteryReading={sensor.currentData.batteryPercentage} />
						</div>
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
		user-select: none;

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

				.sensor-name {
					white-space: pre-wrap;
					word-break: break-word;
				}
			}

			.gauges {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-around;

				&__item {
					display: flex;
					align-items: center;
					flex-direction: column;
					padding: 0 0.5rem;
				}
			}
		}
	}
</style>
