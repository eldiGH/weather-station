export const pluralizePl = (count: number, texts: [string, string, string] | [string, string]) => {
	const absoluteCount = Math.abs(count);

	let plural = '';
	if (absoluteCount === 1) {
		plural = texts[0];
	} else if (texts[2] !== undefined && (absoluteCount === 0 || absoluteCount >= 5)) {
		plural = texts[2];
	} else if (texts[2] === undefined || (absoluteCount > 0 && absoluteCount < 5)) {
		plural = texts[1];
	}

	return `${count} ${plural}`;
};
