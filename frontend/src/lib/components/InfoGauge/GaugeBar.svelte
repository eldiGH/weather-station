<script lang="ts">
	import { getRadians, roundToPrecision } from '$lib/helpers/math';

	export let radius: number;
	export let width: number;
	export let x: number;
	export let y: number;
	export let fromAngle: number;
	export let arcAngle: number;

	export let fill: string = 'transparent';
	export let stroke: string = 'transparent';
	export let strokeWidth: number = 0;

	interface Point {
		x: number;
		y: number;
	}

	interface Arc {
		path: string;
		endPoint: Point;
		endVector: Point;
		endOnCircle: Point;
		startPoint: Point;
		fromAngle: number;
		arcAngle: number;
		radius: number;
	}

	const getArcOfCircle = (
		startPoint: Point,
		radius: number,
		fromAngle: number,
		arcAngle: number
	): Arc => {
		const fromRadians = getRadians(fromAngle);
		const arcRadians = getRadians(arcAngle);

		const start = {
			x: radius * roundToPrecision(Math.cos(fromRadians), 5),
			y: radius * roundToPrecision(Math.sin(fromRadians), 5)
		};

		const endOnCircle = {
			x: radius * roundToPrecision(Math.cos(fromRadians + arcRadians), 5),
			y: radius * roundToPrecision(Math.sin(fromRadians + arcRadians), 5)
		};

		const endVector = {
			x: endOnCircle.x - start.x,
			y: endOnCircle.y - start.y
		};

		const endPoint = {
			x: startPoint.x + endVector.x,
			y: startPoint.y - endVector.y
		};

		const largeArcFlag = arcAngle > 180 || arcAngle < -180;
		const sweepFlag = arcAngle < 0;

		return {
			path: `A ${radius} ${radius} 0 ${largeArcFlag ? 1 : 0} ${sweepFlag ? 1 : 0} ${endPoint.x} ${
				endPoint.y
			}`,
			startPoint,
			endPoint,
			endVector,
			endOnCircle,
			fromAngle,
			arcAngle,
			radius
		};
	};

	const getArcWithOffset = (arc: Arc, offset: number): Arc => {
		const arcStartRadians = getRadians(arc.fromAngle + arc.arcAngle);

		const startOnCircle = {
			x: roundToPrecision((arc.radius + offset) * Math.cos(arcStartRadians), 5),
			y: roundToPrecision((arc.radius + offset) * Math.sin(arcStartRadians), 5)
		};

		const startVector = {
			x: startOnCircle.x - arc.endOnCircle.x,
			y: startOnCircle.y - arc.endOnCircle.y
		};

		const startPoint = {
			x: arc.endPoint.x + startVector.x,
			y: arc.endPoint.y - startVector.y
		};

		const newArc = getArcOfCircle(
			startPoint,
			arc.radius + offset,
			arc.fromAngle + arc.arcAngle,
			-arc.arcAngle
		);

		return newArc;
	};

	$: firstArc = getArcOfCircle({ x, y }, radius, fromAngle, arcAngle);
	$: secondArc = getArcWithOffset(firstArc, -width);

	$: path = `M ${x} ${y} ${firstArc.path} L ${secondArc.startPoint.x} ${secondArc.startPoint.y} ${secondArc.path} Z`;
</script>

<path d={path} {fill} {stroke} stroke-width={strokeWidth} />
