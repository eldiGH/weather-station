<script lang="ts">
	import '$lib/polyfills';

	import '@shared/ui/styles/global.scss';
	import { browser } from '$app/environment';
	import { NavigationLoader } from '@shared/ui/components';
	import { setDefaultOptions } from 'date-fns';
	import { pl } from 'date-fns/locale';
	import type { LayoutProps } from '@shared/ui/types';
	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!document.startViewTransition) {
			return;
		}

		return new Promise((res) => {
			document.startViewTransition(async () => {
				const from = navigation.from?.url.pathname;
				const to = navigation.to?.url.pathname;

				if (from && to) {
					const isBackward = from.length >= to.length;

					const root = document.querySelector<HTMLElement>(':root');

					if (isBackward) {
						root?.classList.add('navigate-backwards');
					} else {
						root?.classList.remove('navigate-backwards');
					}
				}

				res();
				await navigation.complete;
			});
		});
	});

	setDefaultOptions({ locale: pl });

	const { children }: LayoutProps = $props();
</script>

{#if browser}
	<NavigationLoader />
{/if}

{@render children()}

<style lang="scss">
	@use '@shared/ui/styles/themes' as t;

	@keyframes slide-from-right {
		from {
			transform: translateX(100vw);
		}
	}
	@keyframes slide-to-right {
		to {
			transform: translateX(100vw);
		}
	}

	@keyframes slide-from-left {
		from {
			transform: translateX(-100vw);
		}
	}
	@keyframes slide-to-left {
		to {
			transform: translateX(-100vw);
		}
	}

	:root {
		@include t.add-theme('time-sheet');

		&::view-transition-old(root) {
			--forward-to: slide-from-right;
			--forward-from: slide-from-right;

			animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
		}

		&::view-transition-new(root) {
			animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
		}

		&.navigate-backwards {
			&::view-transition-old(root) {
				--forward-to: slide-from-right;
				--forward-from: slide-from-right;

				animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-right;
			}

			&::view-transition-new(root) {
				animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-left;
			}
		}
	}
</style>
