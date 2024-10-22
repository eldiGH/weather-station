<script lang="ts">
	import {
		setTimeSheetEntryFormInputSchema,
		type SetTimeSheetEntryFormInput
	} from '$lib/schemas/timeSheet';
	import FormDialog from '@shared/components/FormDialog.svelte';
	import Input from '@shared/components/Input.svelte';
	import NumericInput from '@shared/components/NumericInput.svelte';
	import { createForm } from '@shared/stores/form';
	import { formatToStringDate } from 'backend/helpers';
	import type { AppRouterOutputs } from 'backend/trpc';
	import { ApiErrorCode, isApiError, type ApiError } from 'backend/types';

	type TimeSheet = AppRouterOutputs['timeSheet']['getTimeSheets'][number];
	type TimeSheetEntry =
		AppRouterOutputs['timeSheet']['getTimeSheetEntriesWithCursor']['entries'][number];

	interface Props {
		timeSheet: TimeSheet;
		open?: () => void;
		editEntry: TimeSheetEntry | null;
		entries: TimeSheetEntry[];
		onEdit: (entry: SetTimeSheetEntryFormInput) => Promise<boolean>;
		onAdd: (entry: SetTimeSheetEntryFormInput) => Promise<boolean | ApiError>;
	}

	const DATE_ALREADY_USED_LABEL = 'Wpis dla tej daty już istnieje';

	// TODO: fix TimeSheet type when https://github.com/sveltejs/kit/issues/12851 will be resolved
	let {
		open = $bindable(),
		timeSheet = {} as TimeSheet,
		editEntry,
		onEdit,
		onAdd,
		entries
	}: Props = $props();

	const form = $derived(
		editEntry
			? createForm(
					{ ...editEntry, timeSheetId: timeSheet.id },
					{ schema: setTimeSheetEntryFormInputSchema, shouldInitialBeValid: false }
				)
			: createForm(
					{
						date: formatToStringDate(new Date()),
						hours: timeSheet.defaultHours ?? 0,
						pricePerHour: timeSheet.defaultPricePerHour ?? 0,
						timeSheetId: timeSheet.id
					},
					{ schema: setTimeSheetEntryFormInputSchema }
				)
	);

	const { values, touchedErrors, touched, isSubmitting, errors, isInitial, isValid } =
		$derived(form);

	let entriesDates = $derived(new Set(entries.values().map((e) => e.date)));

	$effect(() => {
		if (editEntry) {
			return;
		}

		const { date } = $values;

		if (entriesDates.has(date)) {
			errors.set('date', DATE_ALREADY_USED_LABEL);
		}
	});

	const handleAdd = async (entry: SetTimeSheetEntryFormInput) => {
		const response = await onAdd(entry);

		if (!isApiError(response)) {
			return response;
		}

		if (response.errorCode !== ApiErrorCode.TIME_SHEET_ENTRY_ALREADY_EXISTS) {
			return false;
		}

		errors.set('date', DATE_ALREADY_USED_LABEL);
		return false;
	};

	$inspect({ errors: $errors, isInitial: $isInitial, isValid: $isValid });
</script>

<FormDialog
	title={editEntry ? 'Edytuj wpis' : 'Dodaj wpis'}
	onSubmit={editEntry ? onEdit : handleAdd}
	{form}
	bind:open>
	<Input
		bind:value={$values.date}
		bind:touched={$touched.date}
		type="date"
		name="date"
		error={$touchedErrors.date}
		label="Data"
		disabled={$isSubmitting || Boolean(editEntry)} />
	<NumericInput
		bind:value={$values.pricePerHour}
		bind:touched={$touched.pricePerHour}
		name="pricePerHour"
		label="Cena za godzinę"
		min={0}
		error={$touchedErrors.pricePerHour}
		disabled={$isSubmitting}
		decButton
		incButton />
	<NumericInput
		bind:value={$values.hours}
		bind:touched={$touched.hours}
		name="hours"
		label="Godziny"
		min={0}
		max={24}
		error={$touchedErrors.hours}
		disabled={$isSubmitting}
		decButton
		incButton />
</FormDialog>
