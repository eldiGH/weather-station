<script lang="ts">
	export let windDirection: number;

	let className: string | undefined = undefined;
	export { className as class };
</script>

<svg class={className} viewBox="0 0 4 4">
	<path
		class="indicator"
		style={`--rotate:${-windDirection + 90}deg`}
		d="M 2 2.5 L 3 3.5 L 2 0.5 L 1 3.5 Z"
		stroke="transparent"
		fill="white" />
</svg>

<style lang="scss">
	.indicator {
		transition: transform 100ms ease-in-out;
		transform: rotate(var(--rotate));
		transform-origin: 2px 2px;
	}
</style>
