import { browser } from '$app/environment';
import { invalidate } from '$app/navigation';
import { throttle } from '$lib/helpers/throttle';
import { differenceInMilliseconds } from 'date-fns';

const ACTIVITY_TIMEOUT_MS = 8 * 60 * 1000;

export type SubscribedAction = {
	timeout: NodeJS.Timeout | null;
	nextPollDate: Date | null;
	invalidationDependency?: string;
	callback?: () => void;
};

export const createActionPoller = () => {
	const subscribedActions: SubscribedAction[] = [];
	let active = true;

	let lastActivity: Date = new Date();
	let lastActivityTimeout: NodeJS.Timeout | null = null;

	const activityChangeHandlers: ((active: boolean) => void)[] = [];

	const fireActivityChangeHandlers = () => {
		for (const handler of activityChangeHandlers) {
			handler(active);
		}
	};

	const registerActivityChangeHandler = (handler: (active: boolean) => void) => {
		activityChangeHandlers.push(handler);

		const unregister = () => {
			const index = activityChangeHandlers.indexOf(handler);

			if (index < 0) {
				return;
			}

			activityChangeHandlers.splice(index, 1);
		};

		return { unregister };
	};

	const executeAction = (action: SubscribedAction) => {
		if (action.invalidationDependency) {
			invalidate(action.invalidationDependency);
			return;
		}

		if (action.callback) {
			action.callback();
			return;
		}
	};

	const startActionTimeout = (subscribedAction: SubscribedAction) => {
		if (!subscribedAction.nextPollDate) {
			return;
		}

		const timeToNextAction = differenceInMilliseconds(subscribedAction.nextPollDate, new Date());

		if (timeToNextAction <= 0) {
			executeAction(subscribedAction);
			return;
		}

		subscribedAction.timeout = setTimeout(() => {
			executeAction(subscribedAction);
		}, timeToNextAction);
	};

	const subscribeAction = (invalidationDependencyOrCallback: string | (() => void)) => {
		if (!browser) {
			return {
				unsubscribeAction: () => {
					///
				},
				setNextPollDate: () => {
					///
				}
			};
		}

		const subscribedAction: SubscribedAction = {
			timeout: null,
			nextPollDate: null
		};

		if (typeof invalidationDependencyOrCallback === 'string') {
			subscribedAction.invalidationDependency = invalidationDependencyOrCallback;
		} else {
			subscribedAction.callback = invalidationDependencyOrCallback;
		}

		subscribedActions.push(subscribedAction);

		const unsubscribeAction = () => {
			const index = subscribedActions.indexOf(subscribedAction);

			if (index < 0) {
				return;
			}

			subscribedActions.splice(index, 1);
		};

		const setNextPollDate = (date: Date) => {
			subscribedAction.nextPollDate = date;

			if (subscribedAction.timeout !== null) {
				clearTimeout(subscribedAction.timeout);
			}

			if (active) {
				startActionTimeout(subscribedAction);
			}
		};

		return { unsubscribeAction, setNextPollDate };
	};

	const handleInactivity = () => {
		lastActivityTimeout = null;

		deactivate();
	};

	const startInactivityTimeout = () => {
		if (lastActivityTimeout) {
			clearTimeout(lastActivityTimeout);
		}
		lastActivityTimeout = setTimeout(handleInactivity, ACTIVITY_TIMEOUT_MS);
	};

	const deactivate = () => {
		active = false;

		for (const action of subscribedActions) {
			if (action.timeout) {
				clearTimeout(action.timeout);
				action.timeout = null;
			}
		}

		fireActivityChangeHandlers();
	};

	const activate = () => {
		active = true;

		for (const action of subscribedActions) {
			if (action.nextPollDate && !action.timeout) {
				startActionTimeout(action);
			}
		}

		fireActivityChangeHandlers();
	};

	const handleVisibilityChange = () => {
		if (document.hidden) {
			if (lastActivityTimeout) {
				clearTimeout(lastActivityTimeout);
				lastActivityTimeout = null;
			}
			deactivate();
		} else {
			lastActivity = new Date();
			startInactivityTimeout();
			activate();
		}
	};

	const handleActivity = throttle<Event>(
		() => {
			const currentDate = new Date();

			if (differenceInMilliseconds(currentDate, lastActivity) > ACTIVITY_TIMEOUT_MS) {
				activate();
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

	return { subscribeAction, onMount, onDestroy, registerActivityChangeHandler };
};
