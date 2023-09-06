<script>
	import { logout } from '$lib/helpers/auth';
	import Button from './Button.svelte';
	import Link from './Link.svelte';
</script>

<div class="root">
	<div><Link withoutColor class="header" href="/">Weather station app</Link></div>
	<div class="center" />
	<Button on:click={() => logout()} isBlank mode="primary">Wyloguj</Button>
</div>

<style lang="scss">
	@use '../styles/colors.scss';

	.root {
		width: 100%;
		background-color: colors.$deep-saffron;
		min-height: 4rem;
		position: sticky;
		top: 0;
		box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
		display: flex;
		padding: 1rem 2rem;
		align-items: center;

		.center {
			flex-grow: 1;
			display: flex;
			justify-content: center;
		}

		:global(.header) {
			font-size: 1.3rem;
		}
	}
</style>
