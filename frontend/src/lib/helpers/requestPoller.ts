import { browser } from '$app/environment';
import { differenceInMilliseconds } from 'date-fns';
import { throttle } from './throttle';

const ACTIVITY_TIMEOUT_MS = 10 * 60 * 1000;

export const requestPollEventName = 'requestPollChange';

export const createRequestPoller = () => {
	let lastActivity: Date = new Date();
	let lastActivityTimeout: NodeJS.Timeout | null = null;

	const handleVisibilityChange = () => {
		if (document.hidden) {
			if (lastActivityTimeout) {
				clearTimeout(lastActivityTimeout);
				lastActivityTimeout = null;
			}
		} else {
			lastActivity = new Date();
			startInactivityTimeout();
		}

		dispatchRequestPoll(!document.hidden);
	};

	const dispatchRequestPoll = (shouldPoll: boolean) => {
		document.dispatchEvent(new CustomEvent(requestPollEventName, { detail: shouldPoll }));
	};

	const handleInactivity = () => {
		lastActivityTimeout = null;

		dispatchRequestPoll(false);
	};

	const startInactivityTimeout = () => {
		if (lastActivityTimeout) {
			clearTimeout(lastActivityTimeout);
		}
		lastActivityTimeout = setTimeout(handleInactivity, ACTIVITY_TIMEOUT_MS);
	};

	const handleActivity = throttle<Event>(
		() => {
			const currentDate = new Date();

			if (differenceInMilliseconds(currentDate, lastActivity) > ACTIVITY_TIMEOUT_MS) {
				dispatchRequestPoll(true);
			}

			lastActivity = currentDate;

			startInactivityTimeout();
		},
		{ time: 10000 }
	);

	const onMount = () => {
		document.addEventListener('visibilitychange', handleVisibilityChange);
		document.addEventListener('mousemove', handleActivity);
		document.addEventListener('click', handleActivity);

		handleActivity();
	};

	const onDestroy = () => {
		if (!browser) {
			return;
		}

		document.removeEventListener('visibilitychange', handleVisibilityChange);
		document.removeEventListener('mousemove', handleActivity);
		document.removeEventListener('click', handleActivity);

		if (lastActivityTimeout) {
			clearTimeout(lastActivityTimeout);
			lastActivityTimeout = null;
		}
	};

	return { onMount, onDestroy };
};
