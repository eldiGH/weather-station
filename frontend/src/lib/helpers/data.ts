import { browser } from '$app/environment';
import { invalidate } from '$app/navigation';
import { differenceInMilliseconds } from 'date-fns';

export const intervalDateWatcherFactory = (callback: () => void) => {
	let timeout: NodeJS.Timeout | null = null;
	let lastDate: Date | null = null;

	const startDateTimeout = (when: Date) => {
		if (timeout) {
			clearDateTimeout();
		}

		const time = differenceInMilliseconds(when, new Date());

		if (time <= 0) {
			callback();
			return;
		}

		if (!timeout) {
			timeout = setTimeout(() => {
				callback();
				timeout = null;
			}, time);
		}
	};

	const clearDateTimeout = () => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
	};

	const handleVisibilityChange = () => {
		if (document.hidden) {
			clearDateTimeout();
			return;
		}

		if (lastDate) {
			startDateTimeout(lastDate);
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
		clearDateTimeout();
	};

	const onDateUpdate = (when: Date) => {
		if (!browser) {
			return;
		}
		lastDate = when;

		if (timeout) {
			clearDateTimeout();
		}

		startDateTimeout(when);
	};

	return { onMount, onDestroy, onDateUpdate };
};

export const invalidateDataWatcherFactory = (invalidationKey: string) =>
	intervalDateWatcherFactory(() => {
		invalidate(invalidationKey);
	});
