import { browser } from '$app/environment';
import { parse, stringify } from 'devalue';
import { writable } from 'svelte/store';
import cookie from 'cookie';
import { Cookies } from '@sveltejs/kit';

export const cookieStore = <T>(key: string, initialValue: T, serverCookies: Cookies) => {
	let value: T = initialValue;

	console.log(serverCookies);

	if (browser) {
		const cookies = cookie.parse(document.cookie);
		const cookieValue = cookies[key];

		if (typeof cookieValue === 'string') {
			value = parse(cookieValue);
		}
	}

	const store = writable<T>(value);

	store.subscribe((v) => {
		if (browser) {
			document.cookie = cookie.serialize(key, stringify(v));
		}
	});

	return store;
};
