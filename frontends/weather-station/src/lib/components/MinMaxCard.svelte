<script lang="ts">
	import Card from '@shared/components/Card.svelte';
	import IconInfo from '@shared/components/IconInfo.svelte';
	import type { IconType } from '@shared/types/IconType';

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
		icon?: IconType;
	}

	let { readingResult, label, icon }: Props = $props();
</script>

<Card class="minmax-card">
	<div class="container">
		{#if icon}
			<div class="label">
				<IconInfo {icon}>{label}</IconInfo>
			</div>
		{/if}
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
