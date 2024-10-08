<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import Input from '$lib/components/Input.svelte';
	import Link from '$lib/components/Link.svelte';
	import { register } from '$lib/helpers/auth';
	import { createForm } from '$lib/stores/form';
	import { registerInputFormSchema, type RegisterInputForm } from 'backend/schemas';
	import { ApiErrorCode } from 'backend/types';

	const { submit, handleBlur, values, errors, isSubmitting, isValid, touched } = createForm(
		{ email: '', password: '', passwordRepeat: '' },
		registerInputFormSchema
	);

	const handleSubmit = async ({ email, password }: RegisterInputForm) => {
		const error = await register({ email, password });

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
	<Card class="card">
		<span>Rejestracja</span>
		<Input
			bind:value={$values.email}
			on:blur={handleBlur}
			isInvalid={$touched.email && !!$errors.email}
			invalidText={$errors.email}
			label="Email"
			name="email"
			disabled={$isSubmitting} />
		<Input
			bind:value={$values.password}
			on:blur={handleBlur}
			isInvalid={$touched.password && !!$errors.password}
			invalidText={$errors.password}
			label="Hasło"
			name="password"
			type="password"
			disabled={$isSubmitting} />
		<Input
			bind:value={$values.passwordRepeat}
			on:blur={handleBlur}
			isInvalid={$touched.passwordRepeat && !!$errors.passwordRepeat}
			invalidText={$errors.passwordRepeat}
			label="Powtórz hasło"
			name="passwordRepeat"
			type="password"
			disabled={$isSubmitting} />
		<Button busy={$isSubmitting} disabled={!$isValid} type="submit">Zarejestruj</Button>
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
			align-items: center;
			gap: 2rem;
		}
	}
</style>
