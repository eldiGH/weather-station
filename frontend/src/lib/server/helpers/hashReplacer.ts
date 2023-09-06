const dataHashHtmlRegExp =
	/(?<=<script type="application\/json" data-sveltekit-fetched data-url="(?:.*?)" data-hash=")(.*?)(?=">)/gm;

export function hash(...values: unknown[]) {
	let hash = 5381;

	for (const value of values) {
		if (typeof value === 'string') {
			let i = value.length;
			while (i) {
				hash = (hash * 33) ^ value.charCodeAt(--i);
			}
		} else if (ArrayBuffer.isView(value)) {
			const buffer = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
			let i = buffer.length;
			while (i) {
				hash = (hash * 33) ^ buffer[--i];
			}
		} else {
			throw new TypeError('value must be a string or TypedArray');
		}
	}

	return (hash >>> 0).toString(36);
}

/**
 *  This function replaces hash with one that is generated with provided headers
 *  Without that, there is additional request after hydration, on the frontend side
 *  It is caused by missing authorization header during hash generation for ssr
 */
export const replaceHash =
	(headers: Record<string, string>) =>
	({ html }: { html: string }): string => {
		const hashString = Object.entries(headers)
			.map(([key, value]) => [key.toLowerCase(), value].join(','))
			.join(',');
		const dataHash = hash(hashString);

		return html.replace(dataHashHtmlRegExp, dataHash);
	};
