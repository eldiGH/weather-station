<script lang="ts">
	import Card from '@shared/components/Card.svelte';
	import type { LayoutData } from './$types';
	import IconInfo from '@shared/components/IconInfo.svelte';
	import { pluralizePl } from '@shared/helpers/language';
	import Link from '@shared/components/Link.svelte';

	interface Props {
		data: LayoutData;
	}

	type TimeSheet = LayoutData['timeSheets'][number];
	type TimeSheetMonthData = TimeSheet['currentMonth'] & TimeSheet['lastMonth'];

	const { data }: Props = $props();

	$effect(() => {
		console.log(data);
	});
</script>

{#snippet summaryMonth(monthData: TimeSheetMonthData, label: string)}
	<div class="summary-table">
		<div class="summary-title">{label}</div>
		<div class="summary-details">
			<IconInfo gap={0.3} size={40} icon="calendar_month">
				{pluralizePl(monthData.count, ['dzień roboczy', 'dni robocze', 'dni roboczych'])}</IconInfo>
			<IconInfo gap={0.3} size={40} icon="attach_money">
				{monthData.totalPrice} zł</IconInfo>
			<IconInfo gap={0.3} size={40} icon="schedule">
				{pluralizePl(monthData.hours, ['godzina', 'godziny', 'godzin'])}</IconInfo>
		</div>
	</div>
{/snippet}

{#snippet timeSheetCard(timeSheet: TimeSheet)}
	<Link noColor href="/{timeSheet.id}">
		<Card>
			<div class="card">
				<div class="title">{timeSheet.name}</div>
				<div class="month-summaries">
					{@render summaryMonth(timeSheet.currentMonth, 'Obecny miesiąc')}
					{@render summaryMonth(timeSheet.lastMonth, 'Poprzedni miesiąc')}
				</div>
			</div>
		</Card>
	</Link>
{/snippet}

<div class="root">
	{#if data.timeSheets.length === 0}
		Nie masz żadnej karty czasu.
	{:else}
		{#each data.timeSheets as timeSheet}
			{@render timeSheetCard(timeSheet)}
		{/each}
	{/if}
</div>

<style lang="scss">
	.root {
		display: flex;
		justify-content: center;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.card {
		padding: 1rem 1.5rem 2rem;
		display: inline-block;
		font-size: 1.5rem;
		user-select: none;

		.title {
			text-align: center;
			font-size: 3rem;
		}

		.month-summaries {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			margin-top: 1rem;
		}
	}

	.summary-table {
		border: 5px solid white;
		border-radius: 15px;

		.summary-title {
			padding: 0.5rem 1rem;
			border-bottom: 2px solid white;
			text-align: center;
		}

		.summary-details {
			padding: 1rem;
			display: flex;
			flex-direction: column;
		}
	}
</style>
