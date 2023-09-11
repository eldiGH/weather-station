<script lang="ts">
	import type { TabsStore } from '$lib/stores/tabs';
	import { onMount } from 'svelte';

	export let tabNames: string[];
	export let tabsStore: TabsStore;

	let tabs: HTMLDivElement;
	const divs: HTMLDivElement[] = [];

	const calculateIndicatorForDiv = (div: HTMLDivElement) => {
		const width = div.offsetWidth;
		const offset = div.offsetLeft;

		return { width, offset };
	};

	const handleTabChange = (index: number) => {
		const div = divs[index];
		const { width, offset } = calculateIndicatorForDiv(div);

		tabsStore.setTab(index);

		tabs.style.setProperty('--indicator-width', `${width}`);
		tabs.style.setProperty('--indicator-offset', `${offset}px`);
	};

	onMount(() => {
		handleTabChange(0);
	});
</script>

<div bind:this={tabs} class="tabs">
	{#each tabNames as tab, i (tab)}
		<div
			bind:this={divs[i]}
			on:click={() => handleTabChange(i)}
			class="tab"
			class:active={$tabsStore === i}
		>
			{tab}
		</div>
	{/each}
</div>

<style lang="scss">
	.tabs {
		width: 100%;
		display: flex;
		border-bottom: 1px solid gray;
		position: relative;

		.tab {
			padding: 1rem 2rem;
			cursor: pointer;
			user-select: none;

			&:hover {
				background-color: rgba(255, 255, 255, 0.1);
			}

			&.active {
				background-color: rgba(255, 255, 255, 0.1);
			}
		}

		&::after {
			content: '';
			display: block;
			position: absolute;
			bottom: 0;
			height: 2px;
			width: 1px;
			background-color: #f39530;

			transform-origin: left;
			transform: translateX(var(--indicator-offset)) scaleX(var(--indicator-width));
			transition: transform 200ms ease-in-out;
		}
	}
</style>
