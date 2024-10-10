<script lang="ts">
	import Icon from '@shared/components/Icon.svelte';
	import { format, fromUnixTime } from 'date-fns';
	import type { PageData } from './$types';
	import HourlyWeatherStatus from '$lib/components/Weather/HourlyWeatherStatus.svelte';

	export let data: PageData;
</script>

<div class="root">
	<div class="header">
		<button class="back-button" on:click={() => history.back()}>
			<Icon weight={200} opticalSize={48} icon="arrow_back" />
		</button>
		<div class="label">{format(fromUnixTime(data.currentHour.dt), 'HH:mm')}</div>
		<div></div>
	</div>
	<div class="scroll-panel-container">
		<HourlyWeatherStatus data={data.currentHour} />
	</div>
</div>

<style lang="scss">
	.root {
		height: 100%;
		display: flex;
		flex-direction: column;

		.scroll-panel-container {
			min-height: 0;
			flex-grow: 1;
		}

		.header {
			border-bottom: 1px solid grey;
			display: flex;
			align-items: center;
			padding: 0.5rem;
			justify-content: space-between;

			.back-button {
				height: 3rem;
				line-height: 3rem;
				font-size: 3rem;
				cursor: pointer;
				background-color: transparent;
				border: none;
			}

			.label {
				font-size: 2rem;
				text-transform: capitalize;
			}
		}
	}
</style>
