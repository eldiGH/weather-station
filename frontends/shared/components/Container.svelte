<script lang="ts">
	export let pt: number | undefined = undefined;
	export let pb: number | undefined = undefined;
</script>

<div
	style={`padding-top: ${pt ?? 'inherit'}rem; padding-bottom: ${pb ?? 'inherit'}rem`}
	class="container__root">
	<div class="container"><slot /></div>
</div>

<style lang="scss">
	.container {
		width: min(1024px, 100%);
		min-height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;

		&__root {
			min-height: 100%;
			width: 100%;
			display: flex;
			justify-content: center;
		}
	}
</style>
