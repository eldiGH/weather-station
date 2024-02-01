<script lang="ts" context="module">
	export type RippleEvent = MouseEvent & {
		currentTarget: EventTarget & HTMLButtonElement;
	};

	export type ShowRippleFn = (event: RippleEvent) => void;
</script>

<script lang="ts">
	const rippleTimeMs = 400;

	let container: HTMLDivElement;

	export const showRipple: ShowRippleFn = (event) => {
		const diameter = Math.max(event.currentTarget.clientWidth, event.currentTarget.clientHeight);
		const radius = diameter / 2;

		const parentPosition = event.currentTarget.getBoundingClientRect();

		const top = event.clientY - parentPosition.y - radius;
		const left = event.clientX - parentPosition.x - radius;

		const ripple = document.createElement('span');

		ripple.style.width = ripple.style.height = `${diameter}px`;
		ripple.style.top = `${top}px`;
		ripple.style.left = `${left}px`;

		container.appendChild(ripple);

		ripple.classList.add('ripple');

		setTimeout(() => {
			ripple.remove();
		}, rippleTimeMs);
	};
</script>

<div class="ripple__container" style="--ripple-time:{rippleTimeMs}ms;" bind:this={container}></div>

<style lang="scss">
	:global(.ripple) {
		position: absolute;
		border-radius: 50%;
		transform: scale(0);
		animation: ripple var(--ripple-time) ease-out;
		background-color: rgba(255, 255, 255, 0.7);
	}

	.ripple__container {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	@keyframes ripple {
		to {
			transform: scale(2.5);
			opacity: 0;
		}
	}
</style>
