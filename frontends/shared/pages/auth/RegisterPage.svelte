<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '../../components/Button.svelte';
	import Card from '../../components/Card.svelte';
	import Input from '../../components/Input.svelte';
	import Link from '../../components/Link.svelte';
	import { register } from '../../helpers/auth';
	import { createForm } from '../../stores/form';

	import { registerInputFormSchema, type RegisterInputForm } from 'backend/schemas';
	import { ApiErrorCode } from 'backend/types';

	const { submit, values, errors, isSubmitting, isValid, touched } = createForm(
		{ email: '', password: '', passwordRepeat: '' },
		{ schema: registerInputFormSchema }
	);

	const handleSubmit = async ({ email, password }: RegisterInputForm) => {
		const error = await register({ email, password });

		if (error) {
			if (error.errorCode === ApiErrorCode.EMAIL_ALREADY_IN_USE) {
				errors.set('email', 'Ten adres email jest już zajęty');
			}
			return;
		}

		goto('/login');
	};
</script>

<form class="root" onsubmit={submit(handleSubmit)}>
	<Card class="card">
		<span>Rejestracja</span>
		<Input
			bind:value={$values.email}
			bind:touched={$touched.email}
			error={!$touched.email && $errors.email}
			label="Email"
			name="email"
			disabled={$isSubmitting} />
		<Input
			bind:value={$values.password}
			bind:touched={$touched.password}
			error={!$touched.password && $errors.password}
			label="Hasło"
			name="password"
			type="password"
			disabled={$isSubmitting} />
		<Input
			bind:value={$values.passwordRepeat}
			bind:touched={$touched.passwordRepeat}
			error={!$touched.passwordRepeat && $errors.passwordRepeat}
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
