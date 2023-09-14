<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import cookie from 'cookie';
	import { logout, refresh } from '$lib/helpers/auth';
	import { jwt } from '$lib/helpers/jwt';
	import { fromUnixTime } from 'date-fns';
	import { ACCESS_TOKEN_ADVANCE_TIME } from '$lib/constants';
	import { intervalDateWatcherFactory } from '$lib/helpers/data';
	import { browser } from '$app/environment';

	const getDateOfAccessToken = () => {
		if (!browser) {
			return;
		}

		const { refreshToken, accessToken } = cookie.parse(document.cookie);

		if (!refreshToken || !jwt.isValid(refreshToken)) {
			logout();
			return;
		}

		const decodedAccessToken = jwt.decode(accessToken);

		return fromUnixTime(decodedAccessToken.exp - ACCESS_TOKEN_ADVANCE_TIME);
	};

	const refreshToken = async () => {
		const { refreshToken } = cookie.parse(document.cookie);
		const error = await refresh({ refreshToken });

		if (error) {
			logout();
			return;
		}

		date = getDateOfAccessToken();
	};

	const intervalDateWatcher = intervalDateWatcherFactory(refreshToken);

	onMount(() => {
		intervalDateWatcher.onMount();
	});

	onDestroy(() => {
		intervalDateWatcher.onDestroy();
	});

	let date = getDateOfAccessToken();
	$: {
		if (date) {
			intervalDateWatcher.onDateUpdate(date);
		}
	}
</script>
