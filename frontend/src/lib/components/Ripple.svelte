<script lang="ts" context="module">
	export type RippleEvent = MouseEvent & {
		currentTarget: EventTarget & HTMLButtonElement;
	};

	export type ShowRippleFn = (event: RippleEvent) => void;
</script>

<script lang="ts">
	import type { Timer } from '$lib/types/Timer';

	const rippleTimeMs = 400;

	let container: HTMLDivElement;

	const listeners: Timer[] = [];

	export const showRipple: ShowRippleFn = (event) => {
		const diameter = Math.max(event.currentTarget.clientWidth, event.currentTarget.clientHeight);
		const radius = diameter / 2;

		const top = event.clientY - event.currentTarget.offsetTop - radius;
		const left = event.clientX - event.currentTarget.offsetLeft - radius;

		const ripple = document.createElement('span');

		ripple.style.width = ripple.style.height = `${diameter}px`;
		ripple.style.top = `${top}px`;
		ripple.style.left = `${left}px`;

		container.appendChild(ripple);

		ripple.classList.add('ripple');

		const listener = setTimeout(() => {
			ripple.remove();
		}, rippleTimeMs);

		listeners.push(listener);
	};
</script>

<div class="ripple__container" style="--ripple-time:{rippleTimeMs}ms;" bind:this={container}></div>

<style lang="scss">
	:global(.ripple) {
		position: absolute;
		border-radius: 50%;
		transform: scale(0);
		animation: ripple var(--ripple-time) linear;
		background-color: rgba(255, 255, 255, 0.7);
	}

	.ripple__container {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	@keyframes ripple {
		to {
			transform: scale(4);
			opacity: 0;
		}
	}
</style>
