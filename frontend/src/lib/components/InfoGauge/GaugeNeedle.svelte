<script lang="ts">
	export let x: number;
	export let y: number;
	export let length: number;
	export let width: number;
	export let rotation: number = 90;

	export let fill: string = '#737373';
	export let stroke: string = 'transparent';
	export let strokeWidth = 0;

	$: radius = width / 2;
	$: path = `M ${x - radius} ${y} A ${radius} ${radius} 0 0 0 ${x + radius} ${y} L ${x} ${
		y - length
	} Z`;
</script>

<path
	style={`--rotation: ${-rotation + 90}deg; --origin-x:${x}px; --origin-y:${y}px`}
	{fill}
	{stroke}
	stroke-width={strokeWidth}
	d={path}
/>

<style>
	path {
		transform-origin: var(--origin-x) var(--origin-y);
		transition: transform 200ms ease-in-out;
		transform: rotate(var(--rotation, 90deg));
	}
</style>
