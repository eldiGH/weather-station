<script lang="ts">
	import Spinner from './Spinner.svelte';

	export let overlay = false;
	export let show = false;
</script>

{#if show}
	<div class:overlay class="loader-container">
		<div class="spinner">
			<Spinner size={128} thickness={6} />
		</div>
	</div>
{/if}

<style lang="scss">
	.loader-container {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.overlay {
		z-index: 99999;
		background-color: rgba(255, 255, 255, 0.1);
	}

	.spinner {
		z-index: 99999;
	}
</style>
