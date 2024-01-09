<script lang="ts">
	import { onDestroy } from 'svelte';
	import cookie from 'cookie';
	import { logout, refresh } from '$lib/helpers/auth';
	import { fromUnixTime } from 'date-fns';
	import { ACCESS_TOKEN_ADVANCE_TIME } from '$lib/constants';
	import { browser } from '$app/environment';
	import { subscribeAction } from './ActionPoller.svelte';
	import { jwt } from '$lib/helpers/jwt';

	const getExpirationDateOfAccessToken = () => {
		if (!browser) {
			return;
		}

		const { accessToken } = cookie.parse(document.cookie);

		if (!accessToken) {
			return;
		}

		const decodedAccessToken = jwt.decode(accessToken);

		return fromUnixTime(decodedAccessToken.exp - ACCESS_TOKEN_ADVANCE_TIME);
	};

	const handleRefresh = async () => {
		const error = await refresh();

		if (error) {
			logout();
			return;
		}

		date = getExpirationDateOfAccessToken();
	};

	const { setNextPollDate, unsubscribeAction } = subscribeAction(handleRefresh);

	onDestroy(() => {
		unsubscribeAction();
	});

	let date = getExpirationDateOfAccessToken();
	$: {
		if (date) {
			setNextPollDate(date ?? new Date());
		}
	}
</script>
