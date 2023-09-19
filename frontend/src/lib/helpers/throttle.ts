export interface ThrottleOptions {
	time?: number;
	risingEdge?: boolean;
}

export const throttle = <T>(func: (...args: T[]) => void, options?: ThrottleOptions) => {
	const { time, risingEdge }: Required<ThrottleOptions> = {
		time: 1000,
		risingEdge: true,
		...options
	};

	let timeout: NodeJS.Timeout | null = null;

	return (...args: T[]) => {
		if (!timeout) {
			if (risingEdge) {
				func(...args);
			}

			timeout = setTimeout(() => {
				timeout = null;

				if (!risingEdge) {
					func(...args);
				}
			}, time);
		}
	};
};
