<script lang="ts" context="module">
	export interface Tab {
		label: string;
		value?: string | number;
		exactRoute?: boolean;
	}

	export interface TabsClickEvent {
		index: number;
		value?: number | string;
	}
</script>

<script lang="ts">
	import type { TabsStore } from '$lib/stores/tabs';
	import { createEventDispatcher, onMount } from 'svelte';
	import Link from './Link.svelte';
	import { page } from '$app/stores';

	export let tabs: Tab[];
	export let tabsStore: TabsStore | undefined = undefined;
	export let currentTab: number | undefined = undefined;
	export let navigation: boolean | undefined = undefined;

	let tabsDiv: HTMLDivElement;
	const tabItems: HTMLElement[] = [];
	const dispatch = createEventDispatcher<{ click: TabsClickEvent }>();

	const calculateIndicatorForDiv = (div: HTMLElement) => {
		const width = div.offsetWidth;
		const offset = div.offsetLeft;

		return { width, offset };
	};

	const handleTabChange = (index: number, tab: Tab, dispatchEvent: boolean = false) => {
		tabsStore?.setTab(index);
		dispatchEvent && dispatch('click', { index, value: tab.value });
	};

	const getIndexFromUrl = (url: string, tabs: Tab[]) => {
		return tabs.findIndex((tab) => {
			if (typeof tab.value !== 'string') {
				return false;
			}

			return tab.exactRoute ? url === tab.value : url.includes(tab.value);
		});
	};

	const moveIndicator = (tabsDiv: HTMLDivElement, toElement: HTMLElement) => {
		const { width, offset } = calculateIndicatorForDiv(toElement);

		tabsDiv.style.setProperty('--indicator-width', `${width}`);
		tabsDiv.style.setProperty('--indicator-offset', `${offset}px`);
	};

	const shouldBeActive = (url: string, tab: Tab) => {
		if (tab.exactRoute) {
			return url === tab.value;
		}
		return url.includes(tab.value as string);
	};

	$: {
		if (!navigation) {
			const element = tabItems[$tabsStore ?? currentTab ?? 0];
			if (element) {
				moveIndicator(tabsDiv, element);
			}
		}
	}

	$: {
		if (navigation) {
			const element = tabItems[getIndexFromUrl($page.url.pathname, tabs)];
			if (element) {
				moveIndicator(tabsDiv, element);
			}
		}
	}
</script>

<div bind:this={tabsDiv} class="tabs">
	{#each tabs as tab, i (tab)}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		{#if navigation && typeof tab.value === 'string'}
			<Link
				noColor
				href={tab.value}
				bind:ref={tabItems[i]}
				class={`tab ${shouldBeActive($page.url.pathname, tab) ? 'active' : ''}`}
				on:click={() => handleTabChange(i, tab, true)}>{tab.label}</Link
			>
		{:else}
			<div
				bind:this={tabItems[i]}
				on:click={() => handleTabChange(i, tab, true)}
				class="tab"
				class:active={$tabsStore === i || currentTab === i}
			>
				{tab.label}
			</div>
		{/if}
	{/each}
</div>

<style lang="scss">
	.tabs {
		width: 100%;
		display: flex;
		border-bottom: 1px solid gray;
		position: relative;

		:global(.tab) {
			padding: 1rem 2rem;
			cursor: pointer;
			user-select: none;

			&:hover {
				background-color: rgba(255, 255, 255, 0.1);
			}
		}

		:global(.active) {
			background-color: rgba(255, 255, 255, 0.1);
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
