<script lang="ts">
	import { browser } from '$app/environment';
	import { format } from 'date-fns';
	import { onDestroy, onMount } from 'svelte';

	let clockInterval: NodeJS.Timer | null = null;

	const getCurrentTimeString = () => format(new Date(), 'HH:mm:ss');

	let currentTime = getCurrentTimeString();

	const startTimer = () => {
		currentTime = getCurrentTimeString();

		if (clockInterval) {
			return;
		}

		clockInterval = setInterval(() => {
			if (document.hidden) {
				return;
			}

			currentTime = getCurrentTimeString();
		}, 500);
	};

	const stopTimer = () => {
		if (clockInterval) {
			clearInterval(clockInterval);
			clockInterval = null;
		}
	};

	const visibilityCallback = () => {
		if (document.hidden) {
			stopTimer();
		} else {
			startTimer();
		}
	};

	onMount(() => {
		document.addEventListener('visibilitychange', visibilityCallback);

		startTimer();
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('visibilitychange', visibilityCallback);

			stopTimer();
		}
	});
</script>

<div>{currentTime}</div>

<style lang="scss">
	div {
		font-size: 2.5rem;
	}
</style>
