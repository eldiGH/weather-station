<script lang="ts">
	import type { PageData } from './$types';
	import IconInfo from '@shared/components/IconInfo.svelte';
	import { pluralizePl } from '@shared/helpers/language';
	import { addMonths, format } from 'date-fns';
	import { capitalize } from '@shared/helpers/string';
	import Button from '@shared/components/Button.svelte';
	import ConfirmationDialog from '@shared/components/ConfirmationDialog.svelte';
	import { fade, slide } from 'svelte/transition';
	import IconButton from '@shared/components/IconButton.svelte';
	import AddEditTimeSheetDialog from '$lib/components/AddEditTimeSheetDialog.svelte';
	import { snackbar } from '@shared/helpers/snackbar';

	interface Props {
		data: PageData;
	}

	type TimeSheet = (typeof $timeSheets)[number];
	type TimeSheetMonthData = TimeSheet['currentMonth'] & TimeSheet['lastMonth'];

	const { data }: Props = $props();
	let { timeSheets } = $derived(data);

	let currentDate = new Date();

	let selectedTimeSheet: TimeSheet | null = $state(null);

	let openDeleteTimeSheetDialog: undefined | (() => void) = $state();
	let openAddEditTimeSheetDialog: undefined | (() => void) = $state();

	const handleTimeSheetDelete = (timeSheet: TimeSheet) => {
		selectedTimeSheet = timeSheet;
		openDeleteTimeSheetDialog?.();
	};

	const handleDeleteTimeSheet = async () => {
		if (!selectedTimeSheet) {
			snackbar.pushError();
			return false;
		}

		const success = await timeSheets.delete(selectedTimeSheet.id);

		if (!success) {
			return false;
		}

		selectedTimeSheet = null;
		return true;
	};

	const addTimeSheet = () => {
		selectedTimeSheet = null;
		openAddEditTimeSheetDialog?.();
	};

	const editTimeSheet = (timeSheet: TimeSheet) => {
		selectedTimeSheet = timeSheet;
		openAddEditTimeSheetDialog?.();
	};
</script>

{#snippet summaryMonth(monthData: TimeSheetMonthData, label: string)}
	<div class="summary-table">
		<div class="summary-title">{label}</div>
		<div class="summary-details">
			<IconInfo gap={0.4} size={25} icon="calendar_month">
				{pluralizePl(monthData.count, ['dzień roboczy', 'dni robocze', 'dni roboczych'])}</IconInfo>
			<IconInfo gap={0.4} size={25} icon="schedule">
				{pluralizePl(monthData.hours, ['godzina', 'godziny', 'godzin'])}</IconInfo>
			<IconInfo gap={0.4} size={25} icon="attach_money">
				{monthData.totalPrice} zł</IconInfo>
		</div>
	</div>
{/snippet}

{#snippet timeSheetCard(timeSheet: TimeSheet)}
	<div class="card">
		<div class="title">{timeSheet.name}</div>
		<div class="months-summaries">
			{@render summaryMonth(
				timeSheet.lastMonth,
				capitalize(format(addMonths(currentDate, -1), 'LLLL'))
			)}
			<div class="separator"></div>
			{@render summaryMonth(timeSheet.currentMonth, capitalize(format(currentDate, 'LLLL')))}
		</div>
		<div class="actions">
			<div>
				<Button icon="calendar_month" href="/{timeSheet.id}">Widok miesiąca</Button>
			</div>
			<div>
				<Button icon="calendar_view_day" href="/{timeSheet.id}">Widok wpisów</Button>
			</div>
			<div>
				<Button icon="delete" variant="danger" onclick={() => handleTimeSheetDelete(timeSheet)}
					>Usuń</Button>
				<Button icon="edit" onclick={() => editTimeSheet(timeSheet)}>Edytuj</Button>
			</div>
		</div>
	</div>
{/snippet}

<div class="root">
	{#each $timeSheets as timeSheet (timeSheet.id)}
		<div class="card-container" transition:slide>
			{@render timeSheetCard(timeSheet)}
			<div class="separator"></div>
		</div>
	{/each}
	{#if $timeSheets.length === 0}
		<div in:fade={{ duration: 100 }} class="no-time-sheets">Nie masz żadnej karty czasu.</div>
	{/if}
</div>

<div class="add-time-sheet-button">
	<IconButton icon="add" size={40} iconSize={40} shadow onclick={addTimeSheet} />
</div>

<AddEditTimeSheetDialog
	bind:open={openAddEditTimeSheetDialog}
	onSave={timeSheets.add}
	onEdit={timeSheets.edit}
	editTimeSheet={selectedTimeSheet ?? undefined} />

<ConfirmationDialog
	onConfirm={handleDeleteTimeSheet}
	bind:open={openDeleteTimeSheetDialog}
	title="Usunięcie karty czasu"
	>Czy na pewno chcesz trwale usunąć kartę czasu pracy&nbsp;<b>{selectedTimeSheet?.name}</b
	>?</ConfirmationDialog>

<style lang="scss">
	@use '@shared/styles/vars' as v;

	.root {
		.no-time-sheets {
			font-size: 3rem;
			padding: 1rem;
			text-align: center;
		}

		> .separator {
			border-bottom: solid 5px black;
			width: 100%;
		}

		> .separator:last-child {
			border-bottom: none;
		}

		.card {
			padding: 1rem 0 2rem;
			display: inline-flex;
			font-size: 1.5rem;
			flex-direction: column;
			align-items: center;
			width: 100%;

			&-container {
				display: flex;
				justify-content: center;
				gap: 2rem;
				flex-wrap: wrap;
			}

			.title {
				text-align: center;
				font-size: 3rem;
				font-weight: bold;
			}

			.months-summaries {
				display: flex;
				margin: 1rem 0;
				width: 100%;

				> .separator {
					border-left: 3px solid black;
				}

				.summary-table {
					display: flex;
					flex-direction: column;
					align-items: center;
					flex-basis: 50%;

					.summary-title {
						text-align: center;
						font-size: 2rem;
						margin-bottom: 0.2rem;
					}

					.summary-details {
						display: flex;
						flex-direction: column;
						font-size: 1.2rem;
					}
				}
			}

			.actions {
				display: flex;
				flex-direction: column;
				width: 100%;
				gap: 1rem;
				align-items: end;
				padding: 0 2rem;

				> div {
					display: flex;
					gap: 1rem;
				}

				@media screen and (min-width: 768px) {
					flex-direction: row;
					justify-content: center;
				}
			}
		}
	}

	.add-time-sheet-button {
		position: fixed;
		right: 1rem;
		bottom: 1rem;
	}
</style>
