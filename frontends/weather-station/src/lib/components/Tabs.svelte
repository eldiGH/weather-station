<script lang="ts" context="module">
	export interface Tab {
		label: string;
		value?: string | number;
		to?: string;
		exactRoute?: boolean;
	}

	export interface TabsClickEvent {
		index: number;
		value?: number | string;
	}
</script>

<script lang="ts">
	import type { TabsStore } from '$lib/stores/tabs';
	import { createEventDispatcher } from 'svelte';
	import Link from '@shared/components/Link.svelte';
	import { page } from '$app/stores';

	export let tabs: Tab[];
	export let tabsStore: TabsStore | undefined = undefined;
	export let currentTab: number | undefined = undefined;
	export let navigation: boolean | undefined = undefined;
	export let vertical: boolean | undefined = undefined;

	let tabsDiv: HTMLDivElement;
	const tabItems: HTMLElement[] = [];
	const dispatch = createEventDispatcher<{ click: TabsClickEvent }>();

	const calculateIndicatorForDiv = (div: HTMLElement, vertical?: boolean) => {
		let width;
		let offset;
		if (vertical) {
			width = div.offsetHeight;
			offset = div.offsetTop;
		} else {
			offset = div.offsetLeft;
			width = div.offsetWidth;
		}

		return { width, offset };
	};

	const handleTabChange = (index: number, tab: Tab, dispatchEvent: boolean = false) => {
		tabsStore?.setTab(index);
		if (dispatchEvent) {
			dispatch('click', { index, value: tab.value });
		}
	};

	const getIndexFromUrl = (url: string, tabs: Tab[]) => {
		return tabs.findIndex((tab) => {
			if (typeof tab.value !== 'string') {
				return false;
			}

			return tab.exactRoute ? url === tab.value : url.includes(tab.value);
		});
	};

	let moved = false;
	const moveIndicator = (tabsDiv: HTMLDivElement, toElement: HTMLElement, vertical?: boolean) => {
		const { width, offset } = calculateIndicatorForDiv(toElement, vertical);

		tabsDiv.style.setProperty('--indicator-width', `${width / 100}`);
		tabsDiv.style.setProperty('--indicator-offset', `${offset}px`);

		if (!moved) {
			setTimeout(() => {
				moved = true;
			}, 0);
		}
	};

	const shouldBeActive = (url: string, tab: Tab, index: number, currentTab: number) => {
		if (navigation) {
			if (tab.exactRoute) {
				return url === tab.value;
			}
			return url.includes(tab.value as string);
		}

		return currentTab === index;
	};

	$: {
		if (!navigation) {
			const element = tabItems[$tabsStore ?? currentTab ?? 0];
			if (element) {
				moveIndicator(tabsDiv, element, vertical);
			}
		}
	}

	$: {
		if (navigation) {
			const element = tabItems[getIndexFromUrl($page.url.pathname, tabs)];
			if (element) {
				moveIndicator(tabsDiv, element, vertical);
			}
		}
	}

	$: calculatedTabs = tabs.map((tab, i) => ({
		...tab,
		active: shouldBeActive($page.url.pathname, tab, i, $tabsStore ?? currentTab ?? 0)
	}));
</script>

<div class="container">
	<div bind:this={tabsDiv} class:vertical class="tabs" class:animate={moved}>
		<div class:vertical class="tab-items">
			{#each calculatedTabs as tab, i (tab)}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				{#if navigation && typeof tab.value === 'string' && !tab.active}
					<Link
						noColor
						href={tab.to ?? tab.value}
						bind:ref={tabItems[i]}
						class={`tab ${tab.active ? 'active' : ''}`}
						onclick={() => handleTabChange(i, tab, true)}>{tab.label}</Link>
				{:else}
					<div
						bind:this={tabItems[i]}
						onclick={() => handleTabChange(i, tab, true)}
						class="tab"
						class:active={tab.active}>
						{tab.label}
					</div>
				{/if}
			{/each}
		</div>
		<slot />
	</div>
</div>

<style lang="scss">
	.container {
		overflow-x: auto;

		&::-webkit-scrollbar {
			height: 8px;
		}
	}

	.tabs {
		--indicator-offset: 0;
		--indicator-width: 0;

		display: flex;
		position: relative;
		justify-content: space-between;
		align-items: center;
		padding-right: 2rem;
		border-bottom: 1px solid gray;

		.tab-items {
			display: inline-flex;

			:global(.tab) {
				text-align: center;
				padding: 1rem 2rem;
				cursor: pointer;
				user-select: none;

				&:hover {
					background-color: rgba(255, 255, 255, 0.1);
				}
			}

			&.vertical {
				flex-direction: column;
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
			width: 100px;
			background-color: #f39530;

			transform-origin: left;
			transform: translateX(var(--indicator-offset)) scaleX(var(--indicator-width));
		}

		&.animate::after {
			transition: transform 200ms ease-in-out;
		}

		&.vertical {
			display: inline-flex;
			padding-right: 0;
			border-bottom: unset;
			align-items: unset;

			&::after {
				width: 2px;
				height: 100px;
				transform: translateY(var(--indicator-offset)) scaleY(var(--indicator-width));
				transform-origin: top;
				top: 0;
				bottom: unset;
			}
		}
	}
</style>
