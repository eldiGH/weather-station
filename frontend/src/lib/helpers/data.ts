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

	const handleRequestPollChange = (e: Event) => {
		const shouldPoll = (e as CustomEvent<boolean>).detail;

		console.log({ shouldPoll });

		if (!shouldPoll) {
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
		document.addEventListener('requestPollChange', handleRequestPollChange);
	};

	const onDestroy = () => {
		if (!browser) {
			return;
		}

		document.removeEventListener('requestPollChange', handleRequestPollChange);
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
