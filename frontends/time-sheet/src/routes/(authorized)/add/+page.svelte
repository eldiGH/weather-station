<script lang="ts">
	import Card from '@shared/components/Card.svelte';
	import Input from '@shared/components/Input.svelte';
	import { createForm } from '@shared/stores/form';
	import Button from '@shared/components/Button.svelte';
	import NumericInput from '@shared/components/NumericInput.svelte';
	import { createTimeSheetInputSchema, type CreateTimeSheetInput } from 'backend/schemas';
	import { handleAuthedTRPCErrors, trpc } from '@shared/api/trpc';
	import { goto } from '$app/navigation';
	import { ApiErrorCode } from 'backend/types';

	const { values, errors, touched, isSubmitting, handleBlur, isValid, submit } = createForm(
		{ name: '', defaultPricePerHour: undefined, defaultHours: undefined },
		createTimeSheetInputSchema
	);

	const handleSubmit = async (formData: CreateTimeSheetInput) => {
		const { data, error, success } = await handleAuthedTRPCErrors(
			trpc(fetch).timeSheet.createTimeSheet.mutate,
			formData
		);

		if (success) {
			goto(`/${data.id}`);
			return;
		}

		switch (error.errorCode) {
			case ApiErrorCode.TIME_SHEET_NAME_ALREADY_USED: {
				$errors.name = 'Karta czasu pracy z tą nazwą jest już przez Ciebie zajęta';
			}
		}
	};
</script>

<div>
	<Card>
		<form onsubmit={submit(handleSubmit)}>
			<span>Dodaj nową kartę czasu</span>
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
				label="Standardowe godziny"
				name="defaultHours"
				onblur={handleBlur}
				disabled={$isSubmitting}
				inputmode="numeric" />
			<NumericInput
				bind:value={$values.defaultPricePerHour}
				error={$touched.defaultPricePerHour && $errors.defaultPricePerHour}
				label="Standardowa cena"
				name="defaultPricePerHour"
				onblur={handleBlur}
				disabled={$isSubmitting}
				inputmode="numeric" />
			<Button busy={$isSubmitting} disabled={!$isValid} type="submit">Dodaj</Button>
		</form>
	</Card>
</div>

<style lang="scss">
	div {
		display: flex;
		justify-content: center;
		padding-top: 3rem;

		form {
			padding: 2rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1rem;

			> span {
				font-size: 2rem;
				text-align: center;
			}
		}
	}
</style>
