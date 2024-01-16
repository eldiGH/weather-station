<script lang="ts">
	import Card from '../Card.svelte';
	import IconInfo from '../IconInfo.svelte';

	export let windDirection: number;
	export let windSpeed: number;
</script>

<div class="root">
	<Card class="card">
		Wiatr
		<div class="wind">
			<svg class="wind-indicator" viewBox="0 0 4 4">
				<path
					class="indicator"
					style={`--rotate:${-windDirection + 90}deg`}
					d="M 2 2.5 L 3 3.5 L 2 0.5 L 1 3.5 Z"
					stroke="transparent"
					fill="white" />
			</svg>
			<IconInfo gap={0.3} icon="air">{windSpeed} m/s</IconInfo>
		</div>
	</Card>
</div>

<style lang="scss">
	.root {
		font-size: 2rem;

		:global(.card) {
			padding: 2rem;
			display: inline-flex;
			flex-direction: column;
			gap: 2rem;
		}

		.indicator {
			transition: transform 100ms ease-in-out;
			transform: rotate(var(--rotate));
			transform-origin: 2px 2px;
		}

		.wind {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;

			.wind-indicator {
				width: 5rem;
				height: 5rem;
			}
		}
	}
</style>
