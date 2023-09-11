<div class="scroll"><slot /></div>

<style lang="scss">
	.scroll {
		width: 100%;
		height: 100%;
		overflow: auto;

		&::-webkit-scrollbar {
			width: 0.3rem;
		}

		&::-webkit-scrollbar-track {
			box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
		}

		&::-webkit-scrollbar-thumb {
			background-color: rgb(75, 75, 75);
			border-radius: 20px;
		}
	}
</style>
