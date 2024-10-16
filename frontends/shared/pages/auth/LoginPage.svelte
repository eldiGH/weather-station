<script lang="ts">
	import Button from '../../components/Button.svelte';
	import Card from '../../components/Card.svelte';
	import Input from '../../components/Input.svelte';
	import Link from '../../components/Link.svelte';
	import { login } from '../../helpers/auth';
	import { createForm } from '../../stores/form';
	import { loginInputSchema, type LoginInput } from 'backend/schemas';
	import { ApiErrorCode } from 'backend/types';

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
			onblur={handleBlur}
			error={$touched.email && $errors.email}
			label="Email"
			name="email"
			disabled={$isSubmitting} />
		<Input
			bind:value={$values.password}
			onblur={handleBlur}
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

		& :global(.card) {
			padding: 2rem;
			display: flex;
			flex-direction: column;
			gap: 2rem;
			align-items: center;
		}
	}
</style>
