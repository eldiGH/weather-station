<script lang="ts">
	import { onDestroy } from 'svelte';
	import cookie from 'cookie';
	import { logout, refresh } from '$lib/helpers/auth';
	import { fromUnixTime } from 'date-fns';
	import { ACCESS_TOKEN_ADVANCE_TIME } from '$lib/constants';
	import { browser } from '$app/environment';
	import { subscribeAction } from './ActionPoller.svelte';
	import { jwt } from '$lib/helpers/jwt';

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
		// const error = await refresh({ refreshToken });

		// if (error) {
		// 	logout();
		// 	return;
		// }

		date = getDateOfAccessToken();
	};

	const { setNextPollDate, unsubscribeAction } = subscribeAction(refreshToken);

	onDestroy(() => {
		unsubscribeAction();
	});

	let date = getDateOfAccessToken();
	$: {
		if (date) {
			setNextPollDate(date);
		}
	}
</script>
