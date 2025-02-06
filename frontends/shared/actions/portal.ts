import { Action } from 'svelte/action';

export const BODY_PORTAL_KEY = 'bodyPortal';

const portalMap = new Map<string, HTMLElement>();

export const createPortal: Action<HTMLElement, string> = (node, key) => {
	if (portalMap.has(key)) {
		throw new Error('Portal with key already exists');
	}

	portalMap.set(key, node);
	return { destroy: () => portalMap.delete(key) };
};

export const portal: Action<HTMLElement, string | undefined> = (node, key = BODY_PORTAL_KEY) => {
	const target = portalMap.get(key);
	if (!target) {
		throw new Error('Portal with key does not exist');
	}

	target.appendChild(node);

	return {
		destroy: () => {
			if (target.contains(node)) {
				target.removeChild(node);
			}
		}
	};
};
