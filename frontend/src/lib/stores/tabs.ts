import { writable } from 'svelte/store';

export const createTabs = (tabsCount: number) => {
	const currentTab = writable(0);

	const setTab = (tab: number) => {
		let newTab;

		if (tab < 0) {
			newTab = 0;
		} else if (tab >= tabsCount) {
			newTab = tabsCount - 1;
		} else {
			newTab = tab;
		}

		currentTab.set(newTab);
	};

	return { setTab, subscribe: currentTab.subscribe };
};

export type TabsStore = ReturnType<typeof createTabs>;
