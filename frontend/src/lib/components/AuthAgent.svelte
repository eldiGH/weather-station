<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import cookie from 'cookie';
	import { logout, refresh } from '$lib/helpers/auth';
	import { jwt } from '$lib/helpers/jwt';
	import { goto } from '$app/navigation';
	import { getUnixTime } from 'date-fns';
	import { ACCESS_TOKEN_ADVANCE_TIME } from '$lib/constants';

	let timeout: null | NodeJS.Timeout = null;

	const refreshTimeoutCallback = async () => {
		const { refreshToken } = cookie.parse(document.cookie);
		const error = await refresh({ refreshToken });

		if (!error) {
			return scheduleRefresh();
		}

		logout();
	};

	const scheduleRefresh = async () => {
		timeout = null;

		const { refreshToken, accessToken } = cookie.parse(document.cookie);

		if (!refreshToken) {
			return;
		}

		if (!jwt.isValid(refreshToken)) {
			return goto('/login');
		}

		const decodedAccessToken = jwt.decode(accessToken);

		const currentUnixTime = getUnixTime(new Date());
		const timeToRefresh = decodedAccessToken.exp - currentUnixTime - ACCESS_TOKEN_ADVANCE_TIME;

		if (timeToRefresh > 0) {
			timeout = setTimeout(refreshTimeoutCallback, timeToRefresh * 1000);
		} else {
			refreshTimeoutCallback();
		}
	};

	onMount(() => {
		scheduleRefresh();
	});

	onDestroy(() => {
		if (timeout) {
			clearTimeout(timeout);
		}
	});
</script>
