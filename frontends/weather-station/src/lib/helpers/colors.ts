import { minMax } from 'frontend.shared/helpers/math';

export interface RGB {
	r: number;
	g: number;
	b: number;
}

export interface GradientThreshold {
	value: number;
	color: string;
}

export interface NormalizedGradientThreshold {
	toPercentage: number;
	color: RGB;
}

export type Gradient = ReturnType<typeof getGradient>;

const normalizeGradientThresholds = (
	gradientThresholds: GradientThreshold[]
): {
	normalizedGradientThresholds: NormalizedGradientThreshold[];
	min: number;
	max: number;
} => {
	const sortedThresholds = [...gradientThresholds].sort((a, b) => a.value - b.value);

	const min = sortedThresholds[0].value;
	const max = sortedThresholds[sortedThresholds.length - 1].value;

	return {
		min,
		max,
		normalizedGradientThresholds: sortedThresholds.map((t) => ({
			toPercentage: (t.value - min) / (max - min),
			color: toRGB(t.color)
		}))
	};
};

export const getGradient = (gradientThresholds: GradientThreshold[]) => {
	const { min, max, normalizedGradientThresholds } =
		normalizeGradientThresholds(gradientThresholds);

	const calculate = (value: number): string => {
		let startThreshold = normalizedGradientThresholds[0];
		let stopThreshold = normalizedGradientThresholds[1];

		const boundedValue = minMax(value, min, max);
		const percentage = minMax((boundedValue - min) / (max - min), 0, 1);

		if (normalizedGradientThresholds.length > 2) {
			for (let i = 0; i < normalizedGradientThresholds.length - 1; i++) {
				const threshold = normalizedGradientThresholds[i];
				const nextThreshold = normalizedGradientThresholds[i + 1];

				if (percentage >= threshold.toPercentage && percentage <= nextThreshold.toPercentage) {
					startThreshold = threshold;
					stopThreshold = nextThreshold;
					break;
				}
			}
		}

		const thresholdPercentage =
			(percentage - startThreshold.toPercentage) /
			(stopThreshold.toPercentage - startThreshold.toPercentage);

		const newColor = {
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

		return toHex(newColor);
	};

	const getColor = (index: number): string => {
		const color = normalizedGradientThresholds.at(index)?.color;

		if (!color) {
			return '#ffffff';
		}

		return toHex(color);
	};

	return { calculate, getColor };
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
