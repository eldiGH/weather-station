export const roundToPrecision = (num: number, precision = 2) => {
	const base = Math.pow(10, precision);

	return Math.round(num * base) / base;
};

export const getRadians = (angle: number) => angle * (Math.PI / 180);
