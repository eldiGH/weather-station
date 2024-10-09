<script lang="ts">
	import { sidebarStore } from '$lib/stores/sidebar';
	import { onMount } from 'svelte';
	import IconButton from './IconButton.svelte';
	import type { IconType } from '$lib/types/IconType';
	import Button from '@shared/components/Button.svelte';

	let sidebarWidth = 0;
	let sidebar: HTMLDivElement;

	onMount(() => {
		sidebarWidth = sidebar.clientWidth;
	});

	const items: { icon: IconType; label: string; url: string }[] = [
		{ icon: 'sensors', label: 'Sensory', url: '/sensors' },
		{ icon: 'view_module', label: 'Kioski', url: '/kiosks' }
	];
</script>

<div class="container" style="--sidebar-width: {sidebarWidth}px;" class:opened={$sidebarStore}>
	<div bind:this={sidebar} class="sidebar">
		<div>
			{#each items as item}
				<div class="sidebar__item">
					{#if !$sidebarStore}
						<IconButton size={24} icon={item.icon} /><Button>{item.label}</Button>
					{:else}
						<Button
							><IconButton size={24} icon={item.icon} />
							{item.label}</Button>
					{/if}
				</div>
			{/each}
		</div>
	</div>
	<div class="content">
		<slot />
	</div>
</div>

<style lang="scss">
	$topbarHeight: 64px;
	$animation: 200ms ease-in-out;
	$closedWidth: 64px;
	$openedWidth: 160px;

	.container {
		display: flex;

		.sidebar {
			background-color: var(--sidebar-color);
			z-index: 2000;

			width: $closedWidth;

			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			padding: 1rem 0.5rem 0 0.5rem;

			transition: width $animation;

			position: sticky;
			top: $topbarHeight;

			align-self: flex-start;
			height: calc(100vh - $topbarHeight);

			> div {
				overflow: hidden;
			}

			&__item {
				display: flex;
				align-items: center;

				> :global(.btn) {
					width: 100%;
					padding: 0 1em 0 0;
				}

				:global(.btn) {
					background-color: var(--sidebar-color);
				}
			}
		}

		&.opened {
			.sidebar {
				width: $openedWidth;
			}
		}
	}
</style>
