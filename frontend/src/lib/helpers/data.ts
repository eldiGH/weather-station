import { browser } from '$app/environment';
import { invalidate } from '$app/navigation';
import { differenceInMilliseconds } from 'date-fns';

export const intervalDateWatcherFactory = (callback: () => void) => {
	let timeout: NodeJS.Timeout | null = null;
	let lastDate: Date | null = null;

	const startInvalidationTimeout = (when: Date) => {
		lastDate = when;

		if (timeout) {
			clearInvalidationTimeout();
		}

		if (!timeout) {
			timeout = setTimeout(() => {
				callback();
				timeout = null;
			}, differenceInMilliseconds(when, new Date()));
		}
	};

	const clearInvalidationTimeout = () => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
	};

	const handleVisibilityChange = () => {
		if (document.hidden) {
			clearInvalidationTimeout();
			return;
		}

		if (lastDate) {
			startInvalidationTimeout(lastDate);
		}
	};

	const onMount = () => {
		if (!browser) {
			return;
		}
		document.addEventListener('visibilitychange', handleVisibilityChange);
	};

	const onDestroy = () => {
		if (!browser) {
			return;
		}

		document.removeEventListener('visibilitychange', handleVisibilityChange);
		clearInvalidationTimeout();
	};

	const onDateUpdate = (when: Date) => {
		if (!browser) {
			return;
		}
		lastDate = when;

		if (timeout) {
			clearInvalidationTimeout();
		}

		startInvalidationTimeout(when);
	};

	return { onMount, onDestroy, onDateUpdate };
};

export const invalidateDataWatcherFactory = (invalidationKey: string) =>
	intervalDateWatcherFactory(() => {
		invalidate(invalidationKey);
	});
