<script lang="ts">
	export let size = 80;
	export let thickness = size / 10;
</script>

<div style={`--size: ${size}px; --thickness: ${thickness}px;`} class="loader"></div>

<style lang="scss">
	.loader {
		width: var(--size);
		aspect-ratio: 1;
		border: var(--thickness) solid #fff;
		border-radius: 50%;

		animation:
			1.5s linear infinite clipping,
			1.6s linear infinite rotate;
	}

	@keyframes clipping {
		0%,
		10% {
			clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%);
		}

		21.666% {
			clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 0 100%, 0 100%, 0 100%, 0 100%);
		}

		33.333% {
			clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 0 100%, 0 0%, 0 0%, 0 0%);
		}

		45%,
		55% {
			clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 0 100%, 0 0%, 100% 0, 100% 0);
		}

		62% {
			clip-path: polygon(50% 50%, 100% 100%, 100% 100%, 0 100%, 0 0, 100% 0, 100% 25%);
		}

		69% {
			clip-path: polygon(50% 50%, 0% 100%, 0 100%, 0 100%, 0 0, 100% 0, 100% 50%);
		}

		76% {
			clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 100% 0, 100% 75%);
		}

		83% {
			clip-path: polygon(50% 50%, 50% 0, 50% 0, 50% 0, 50% 0, 100% 0, 100% 100%);
		}

		90%,
		100% {
			clip-path: polygon(50% 50%, 100% 50%, 100% 50%, 100% 50%, 100% 50%, 100% 0, 100% 100%);
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}
</style>
