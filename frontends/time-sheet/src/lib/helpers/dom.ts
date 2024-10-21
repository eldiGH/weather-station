export const getBodyHeight = () => {
	const body = document.body;
	const html = document.documentElement;

	return Math.max(
		body.scrollHeight,
		body.offsetHeight,
		html.clientHeight,
		html.scrollHeight,
		html.scrollHeight
	);
};
