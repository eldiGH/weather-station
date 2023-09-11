<script>
	import { logout } from '$lib/helpers/auth';
	import Button from './Button.svelte';
	import Container from './Container.svelte';
	import Link from './Link.svelte';
	import ScrollPanel from './ScrollPanel.svelte';
</script>

<div class="root">
	<div class="topbar">
		<div class="left-slot"><slot name="left" /></div>
		<div class="center-slot"><slot name="center" /></div>
		<div class="right-slot"><slot name="right" /></div>
	</div>
	<div class="content">
		<ScrollPanel>
			<Container>
				<slot />
			</Container>
		</ScrollPanel>
	</div>
</div>

<style lang="scss">
	@use '../styles/colors.scss';

	.root {
		height: 100%;
		display: flex;
		flex-direction: column;

		.topbar {
			width: 100%;
			background-color: colors.$deep-saffron;
			min-height: 4rem;
			position: sticky;
			top: 0;
			box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
			padding: 0.5rem 1rem;
			display: flex;
			z-index: 1000;

			> div {
				flex-basis: 33%;
				flex-grow: 1;
				display: flex;
				align-items: center;

				&.left-slot {
					justify-content: flex-start;
				}

				&.center-slot {
					justify-content: center;
				}

				&.right-slot {
					justify-content: flex-end;
				}
			}

			:global(.header) {
				font-size: 1.3rem;
			}
		}

		.content {
			min-height: 0;
			flex-grow: 1;
		}
	}
</style>
