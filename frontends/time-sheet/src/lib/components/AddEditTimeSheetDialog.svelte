<script lang="ts">
	import FormDialog from '@shared/components/FormDialog.svelte';
	import Input from '@shared/components/Input.svelte';
	import NumericInput from '@shared/components/NumericInput.svelte';
	import { snackbar } from '@shared/helpers/snackbar';
	import { createForm } from '@shared/stores/form';
	import {
		createTimeSheetInputSchema,
		type CreateTimeSheetInput,
		type EditTimeSheetInput
	} from 'backend/schemas';
	import type { AppRouterOutputs } from 'backend/trpc';
	import { isApiError, type ApiError } from 'backend/types';

	const NAME_TAKEN_ERROR_LABEL = 'Ta nazwa jest już przez Ciebie używana.';

	type TimeSheet = AppRouterOutputs['timeSheet']['getTimeSheets'][number];

	interface Props {
		open?: () => void;
		onSave: (data: CreateTimeSheetInput) => Promise<boolean>;
		onEdit: (data: EditTimeSheetInput) => Promise<boolean | ApiError>;
		editTimeSheet?: TimeSheet;
		onClosed?: () => void;
		timeSheets?: TimeSheet[];
	}

	let { open = $bindable(), onSave, onEdit, editTimeSheet, onClosed, timeSheets }: Props = $props();
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
			createTimeSheetInputSchema
		)
	);

	const { errors, handleBlur, isSubmitting, submit, touched, values } = $derived(form);

	const handleEdit = async (data: CreateTimeSheetInput) => {
		if (!editTimeSheet) {
			snackbar.pushError();
			return false;
		}

		const result = await onEdit({ ...data, timeSheetId: editTimeSheet?.id });

		if (isApiError(result)) {
			$errors.name = NAME_TAKEN_ERROR_LABEL;
			return false;
		}

		return result;
	};

	let timeSheetNamesUsed = $derived(
		new Set(timeSheets?.filter((t) => t.id !== editTimeSheet?.id).map((t) => t.name))
	);

	$effect(() => {
		if (timeSheetNamesUsed.has($values.name)) {
			$errors.name = NAME_TAKEN_ERROR_LABEL;
		}
	});

	$inspect($errors);
</script>

<FormDialog
	bind:open
	title={isEdit ? 'Edytuj kartę czasu pracy' : 'Dodaj kartę czasu pracy'}
	submitButtonLabel={isEdit ? 'Zapisz' : 'Dodaj'}
	onSubmit={submit(isEdit ? handleEdit : onSave)}
	{onClosed}
	{form}>
	<Input
		bind:value={$values.name}
		error={$touched.name && $errors.name}
		label="Nazwa"
		name="name"
		onblur={handleBlur}
		disabled={$isSubmitting}
		required />
	<NumericInput
		bind:value={$values.defaultHours}
		error={$touched.defaultHours && $errors.defaultHours}
		label="Godziny przyszłych wpisów"
		name="defaultHours"
		onblur={handleBlur}
		disabled={$isSubmitting}
		inputmode="numeric"
		min={0}
		max={24} />
	<NumericInput
		bind:value={$values.defaultPricePerHour}
		error={$touched.defaultPricePerHour && $errors.defaultPricePerHour}
		label="Cena przyszłych wpisów"
		name="defaultPricePerHour"
		onblur={handleBlur}
		disabled={$isSubmitting}
		inputmode="numeric"
		min={0} />
</FormDialog>
