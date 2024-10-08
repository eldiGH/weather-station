<div class="root">
	<div class="topbar">
		<div class="left-slot"><slot name="left" /></div>
		<div class="center-slot"><slot name="center" /></div>
		<div class="right-slot"><slot name="right" /></div>
	</div>
	<div class="content">
		<slot />
	</div>
</div>

<style lang="scss">
	.root {
		min-height: 100%;
		display: flex;
		flex-direction: column;

		.topbar {
			width: 100%;
			background-color: var(--top-bar-background);
			min-height: 4rem;
			position: sticky;
			top: 0;
			box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
			padding: 0.5rem 1rem 0.5rem 0.5rem;
			display: flex;
			z-index: 1000;

			> div {
				flex-basis: 33%;
				flex-grow: 1;
				display: flex;
				align-items: center;

				&.left-slot {
					justify-content: flex-start;
				}

				&.center-slot {
					justify-content: center;
				}

				&.right-slot {
					justify-content: flex-end;
				}
			}

			:global(.header) {
				font-size: 1.3rem;
			}
		}

		.content {
			min-height: 0;
			display: flex;
			flex-grow: 1;
		}
	}
</style>
