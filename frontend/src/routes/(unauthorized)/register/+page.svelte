<script lang="ts">
	import { goto } from '$app/navigation';
	import { registerRequest } from '$lib/api/auth';
	import { handleApiError } from '$lib/api/client';
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import { createForm } from '$lib/stores/form';
	import { Card, Input } from 'agnostic-svelte';
	import { type RegisterRequestForm, registerRequestFormSchema, ApiErrorCode } from 'shared';

	const { submit, handleBlur, values, errors, isSubmitting, isValid, touched } = createForm(
		{ email: '', password: '', passwordRepeat: '' },
		registerRequestFormSchema
	);

	const handleSubmit = async (formData: RegisterRequestForm) => {
		const { data, error } = await handleApiError(registerRequest, fetch, formData);

		if (error) {
			if (error.errorCode === ApiErrorCode.EMAIL_ALREADY_IN_USE) {
				$errors.email = 'Ten adres email jest już zajęty';
			}
			return;
		}

		goto('/login');
	};
</script>

<form class="root" on:submit={submit(handleSubmit)}>
	<Card isBorder isRounded isShadow isStacked css="card">
		<span>Rejestracja</span>
		<Input
			bind:value={$values.email}
			on:blur={handleBlur}
			isInvalid={$touched.email && !!$errors.email}
			invalidText={$errors.email}
			label="Email"
			name="email"
			disabled={$isSubmitting}
		/>
		<Input
			bind:value={$values.password}
			on:blur={handleBlur}
			isInvalid={$touched.password && !!$errors.password}
			invalidText={$errors.password}
			label="Hasło"
			name="password"
			type="password"
			disabled={$isSubmitting}
		/>
		<Input
			bind:value={$values.passwordRepeat}
			on:blur={handleBlur}
			isInvalid={$touched.passwordRepeat && !!$errors.passwordRepeat}
			invalidText={$errors.passwordRepeat}
			label="Powtórz hasło"
			name="passwordRepeat"
			type="password"
			disabled={$isSubmitting}
		/>
		<Button isBusy={$isSubmitting} isDisabled={!$isValid} type="submit" mode="primary"
			>Zarejestruj</Button
		>
		<div>Masz już konto? <Link href="/login">Zaloguj się</Link></div>
	</Card>
</form>

<style lang="scss">
	.root {
		width: 20rem;

		span {
			font-size: 2rem;
		}

		:global(.card) {
			padding: 2rem;
			display: flex;
			flex-direction: column;
			gap: 2rem;
		}
	}
</style>
