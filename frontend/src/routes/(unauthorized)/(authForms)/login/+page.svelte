<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import { createForm } from '$lib/stores/form';
	import { login } from '$lib/helpers/auth';
	import { loginInputSchema, type LoginInput } from 'backend/schemas';
	import { ApiErrorCode } from 'backend/types';
	import Input from '$lib/components/Input.svelte';
	import Card from '$lib/components/Card.svelte';

	const { submit, handleBlur, values, errors, isSubmitting, isValid, touched } = createForm(
		{ email: '', password: '' },
		loginInputSchema
	);

	const handleSubmit = async (formData: LoginInput) => {
		const error = await login(formData);

		if (!error) return;

		if (error.errorCode === ApiErrorCode.EMAIL_OR_PASSWORD_NOT_VALID) {
			$errors.email = 'Podane dane są nieprawidłowe';
		}
	};
</script>

<form class="root" on:submit={submit(handleSubmit)}>
	<Card class="card">
		<span>Logowanie</span>
		<Input
			bind:value={$values.email}
			on:blur={handleBlur}
			error={$touched.email && $errors.email}
			label="Email"
			name="email"
			disabled={$isSubmitting} />
		<Input
			bind:value={$values.password}
			on:blur={handleBlur}
			error={$touched.password && $errors.password}
			label="Hasło"
			name="password"
			type="password"
			disabled={$isSubmitting} />
		<Button busy={$isSubmitting} disabled={!$isValid} type="submit">Zaloguj</Button>
		<div>Nie masz konta? <Link href="/register">Zarejestruj się</Link></div>
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
			align-items: center;
		}
	}
</style>
