import { getGradient } from '$lib/helpers/colors';
import { IDEAL_TEMPERATURE, MAX_TEMPERATURE } from './ambient';

export const TEMP_GRADIENT = getGradient([
	{ value: 5, color: '#3b41ff' },
	{ value: 15, color: '#5293fa' },
	{ value: IDEAL_TEMPERATURE, color: '#0ac947' },
	{ value: 31, color: '#fff700' },
	{ value: 35, color: '#ff7a21' },
	{ value: MAX_TEMPERATURE, color: '#ff2424' }
]);

export const HUM_GRADIENT = getGradient([
	{ value: 0, color: '#ff2424' },
	{ value: 35, color: '#fff700' },
	{ value: 50, color: '#0ac947' },
	{ value: 65, color: '#fff700' },
	{ value: 100, color: '#ff2424' }
]);
