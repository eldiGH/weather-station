<div class="container__root"><div class="container"><slot /></div></div>

<style lang="scss">
	.container {
		width: min(1024px, 100%);
		min-height: 100%;
		display: flex;
		justify-content: center;

		&__root {
			min-height: 100%;
			padding: 0 2rem;
			width: 100%;
			display: flex;
			justify-content: center;
		}
	}
</style>
