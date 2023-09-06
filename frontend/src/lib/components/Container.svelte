<div class="container__root"><div class="container"><slot /></div></div>

<style lang="scss">
	.container {
		width: min(1024px, 100%);
		display: flex;
		justify-content: center;

		&__root {
			padding: 4rem 2rem 0;
			width: 100%;
			display: flex;
			justify-content: center;
		}
	}
</style>
