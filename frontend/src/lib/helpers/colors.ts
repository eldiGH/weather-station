import { minMax } from './math';

export interface RGB {
	r: number;
	g: number;
	b: number;
}

export interface Threshold {
	value: number;
	color: RGB;
}

export const calculateGradientNormalized = (percentage: number, thresholds: Threshold[]): RGB => {
	const sortedThresholds = [...thresholds].sort((a, b) => a.value - b.value);

	if (sortedThresholds.length < 2) {
		return { r: 0, g: 0, b: 0 };
	}

	let startThreshold = sortedThresholds[0];
	let stopThreshold = sortedThresholds[1];

	if (sortedThresholds.length > 2) {
		for (let i = 0; i < sortedThresholds.length - 1; i++) {
			const threshold = sortedThresholds[i];
			const nextThreshold = sortedThresholds[i + 1];

			if (percentage >= threshold.value && percentage <= nextThreshold.value) {
				startThreshold = threshold;
				stopThreshold = nextThreshold;
				break;
			}
		}
	}

	const thresholdPercentage =
		(percentage - startThreshold.value) / (stopThreshold.value - startThreshold.value);

	return {
		r: Math.round(
			startThreshold.color.r +
				thresholdPercentage * (stopThreshold.color.r - startThreshold.color.r)
		),
		g: Math.round(
			startThreshold.color.g +
				thresholdPercentage * (stopThreshold.color.g - startThreshold.color.g)
		),
		b: Math.round(
			startThreshold.color.b +
				thresholdPercentage * (stopThreshold.color.b - startThreshold.color.b)
		)
	};
};

export const calculateGradient = (value: number, thresholds: Threshold[]): RGB => {
	const sortedThresholds = [...thresholds].sort((a, b) => a.value - b.value);

	const boundedValue = minMax(
		value,
		sortedThresholds[0].value,
		sortedThresholds[sortedThresholds.length - 1].value
	);

	const normalizationValue = sortedThresholds[0].value;
	const normalizedMax = sortedThresholds[sortedThresholds.length - 1].value - normalizationValue;
	const percentage = (boundedValue - normalizationValue) / normalizedMax;

	return calculateGradientNormalized(
		percentage,
		sortedThresholds.map((t) => ({ ...t, value: (t.value - normalizationValue) / normalizedMax }))
	);
};

export const toRGB = (hex: string): RGB => {
	return {
		r: parseInt(hex.slice(1, 3), 16),
		g: parseInt(hex.slice(3, 5), 16),
		b: parseInt(hex.slice(5, 7), 16)
	};
};

const formatHexNumber = (hex: string) => (hex.length < 2 ? `0${hex}` : hex);

export const toHex = (rgb: RGB): string => {
	const r = rgb.r.toString(16);
	const g = rgb.g.toString(16);
	const b = rgb.b.toString(16);

	return `#${formatHexNumber(r)}${formatHexNumber(g)}${formatHexNumber(b)}`;
};
