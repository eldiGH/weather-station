<script lang="ts">
	import Card from './Card.svelte';
	import IconInfo from './IconInfo.svelte';

	interface FormattedResult {
		value: string;
		at: string;
	}

	interface FormattedMinMaxResult {
		min: FormattedResult;
		max: FormattedResult;
	}

	interface Props {
		readingResult: FormattedMinMaxResult;
		label?: string;
	}

	let { readingResult, label }: Props = $props();
</script>

<Card class="minmax-card">
	<div class="container">
		<div class="label">
			<IconInfo icon="device_thermostat">{label}</IconInfo>
		</div>
		<div class="minmax-container">
			<div class="minmax">
				Min
				<span>{readingResult.min.value}</span>
				<span>{readingResult.min.at}</span>
			</div>
			<div class="separator"></div>
			<div class="minmax">
				Max
				<span>{readingResult.max.value}</span>
				<span>{readingResult.max.at}</span>
			</div>
		</div>
	</div>
</Card>

<style lang="scss">
	:global(.minmax-card) {
		padding: 1rem;
	}

	.container {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;

		.label {
			font-size: 2rem;
		}

		.minmax-container {
			display: flex;
			gap: 1rem;
			justify-content: center;
			align-items: stretch;

			.minmax {
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 1.5rem;
			}

			.separator {
				border-left: 2px solid white;
			}
		}
	}
</style>
