<script lang="ts">
	import { getArcOfCircle, getArcWithOffset } from '$lib/helpers/svg';

	export let radius: number;
	export let width: number;
	export let x: number;
	export let y: number;
	export let fromAngle: number;
	export let arcAngle: number;

	export let fill: string = 'transparent';
	export let stroke: string = 'transparent';
	export let strokeWidth: number = 0;

	$: firstArc = getArcOfCircle({ x, y }, radius, fromAngle, arcAngle);
	$: secondArc = getArcWithOffset(firstArc, -width);

	$: path = `M ${firstArc.startPoint.x} ${firstArc.startPoint.y} ${firstArc.path} L ${secondArc.startPoint.x} ${secondArc.startPoint.y} ${secondArc.path} Z`;
</script>

<path d={path} {fill} {stroke} stroke-width={strokeWidth} />
