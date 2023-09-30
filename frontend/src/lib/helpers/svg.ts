import { getRadians, roundToPrecision } from './math';

export interface Point {
	x: number;
	y: number;
}

export interface Arc {
	path: string;
	endPoint: Point;
	endVector: Point;
	endOnCircle: Point;
	startPoint: Point;
	fromAngle: number;
	arcAngle: number;
	radius: number;
}

export const getArc = (
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

export const getArcOfCircle = (
	circleCenter: Point,
	radius: number,
	fromAngle: number,
	arcAngle: number
) => {
	const angle = fromAngle + (fromAngle <= 180 ? 180 : -180);
	const radians = getRadians(angle);
	const calculatedStartPoint = {
		x: circleCenter.x - roundToPrecision(radius * Math.cos(radians), 5),
		y: circleCenter.y + roundToPrecision(radius * Math.sin(radians), 5)
	};

	return getArc(calculatedStartPoint, radius, fromAngle, arcAngle);
};

export const getArcWithOffset = (arc: Arc, offset: number): Arc => {
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

	return getArc(startPoint, arc.radius + offset, arc.fromAngle + arc.arcAngle, -arc.arcAngle);
};
