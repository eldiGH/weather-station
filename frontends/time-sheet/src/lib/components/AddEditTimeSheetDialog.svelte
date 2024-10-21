<script lang="ts">
	import FormDialog from '@shared/components/FormDialog.svelte';
	import Input from '@shared/components/Input.svelte';
	import NumericInput from '@shared/components/NumericInput.svelte';
	import { snackbar } from '@shared/helpers/snackbar';
	import { createForm } from '@shared/stores/form';
	import {
		addTimeSheetInputSchema,
		type AddTimeSheetInput,
		type EditTimeSheetInput
	} from 'backend/schemas';
	import type { AppRouterOutputs } from 'backend/trpc';
	import { isApiError, type ApiError } from 'backend/types';

	const NAME_TAKEN_ERROR_LABEL = 'Ta nazwa jest już przez Ciebie używana.';

	type TimeSheet = AppRouterOutputs['timeSheet']['getTimeSheets'][number];

	interface Props {
		open?: () => void;
		onAdd: (data: AddTimeSheetInput) => Promise<boolean>;
		onEdit: (data: EditTimeSheetInput) => Promise<boolean | ApiError>;
		editTimeSheet?: TimeSheet;
		onClosed?: () => void;
		timeSheets?: TimeSheet[];
	}

	let { open = $bindable(), onAdd, onEdit, editTimeSheet, onClosed, timeSheets }: Props = $props();
	let isEdit = $derived(Boolean(editTimeSheet));

	const form = $derived(
		createForm(
			editTimeSheet
				? {
						name: editTimeSheet.name,
						defaultHours: editTimeSheet.defaultHours ?? undefined,
						defaultPricePerHour: editTimeSheet.defaultPricePerHour ?? undefined
					}
				: { name: '', defaultHours: undefined, defaultPricePerHour: undefined },
			{ schema: addTimeSheetInputSchema, shouldInitialBeValid: false }
		)
	);

	const { handleBlur, isSubmitting, values, touchedErrors, setError } = $derived(form);

	const handleEdit = async (data: AddTimeSheetInput) => {
		if (!editTimeSheet) {
			snackbar.pushError();
			return false;
		}

		const result = await onEdit({ ...data, timeSheetId: editTimeSheet?.id });

		if (isApiError(result)) {
			setError('name', NAME_TAKEN_ERROR_LABEL);
			return false;
		}

		return result;
	};

	let timeSheetNamesUsed = $derived(
		new Set(timeSheets?.filter((t) => t.id !== editTimeSheet?.id).map((t) => t.name))
	);

	$effect(() => {
		if (timeSheetNamesUsed.has($values.name)) {
			setError('name', NAME_TAKEN_ERROR_LABEL);
		}
	});
</script>

<FormDialog
	bind:open
	title={isEdit ? `Edytuj kartę czasu ${editTimeSheet?.name}` : 'Dodaj kartę czasu'}
	submitButtonLabel={isEdit ? 'Zapisz' : 'Dodaj'}
	onSubmit={isEdit ? handleEdit : onAdd}
	{onClosed}
	{form}>
	<Input
		bind:value={$values.name}
		error={$touchedErrors.name}
		label="Nazwa"
		name="name"
		onblur={handleBlur}
		disabled={$isSubmitting}
		required />
	<NumericInput
		bind:value={$values.defaultHours}
		error={$touchedErrors.defaultHours}
		label="Godziny przyszłych wpisów"
		name="defaultHours"
		onblur={handleBlur}
		disabled={$isSubmitting}
		inputmode="numeric"
		min={0}
		max={24} />
	<NumericInput
		bind:value={$values.defaultPricePerHour}
		error={$touchedErrors.defaultPricePerHour}
		label="Cena przyszłych wpisów"
		name="defaultPricePerHour"
		onblur={handleBlur}
		disabled={$isSubmitting}
		inputmode="numeric"
		min={0} />
</FormDialog>
