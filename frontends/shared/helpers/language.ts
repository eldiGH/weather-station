const NON_BRAKING_SPACE_CODE = '\xa0';

export const pluralizePl = (count: number, texts: [string, string, string] | [string, string]) => {
	const absoluteCount = Math.abs(count);

	let plural = '';
	if (absoluteCount === 1) {
		plural = texts[0];
	} else if (
		texts[2] === undefined ||
		(absoluteCount > 0 && absoluteCount < 5) ||
		(absoluteCount > 21 && absoluteCount % 10 > 1 && absoluteCount % 10 < 5)
	) {
		plural = texts[1];
	} else if (texts[2] !== undefined && (absoluteCount === 0 || absoluteCount >= 5)) {
		plural = texts[2];
	}

	return `${count}${NON_BRAKING_SPACE_CODE}${plural}`;
};
