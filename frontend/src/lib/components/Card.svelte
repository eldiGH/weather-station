<script lang="ts">
	let className = '';
	export { className as class };
</script>

<div class={className}><slot /></div>

<style lang="scss">
	@use '../styles/theme.scss' as theme;

	div {
		display: inline-block;
		border: 1px solid theme.$card-border;
		border-radius: 5px;
		box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
	}
</style>
