import { format, fromUnixTime } from 'date-fns';

export const formatTemperature = (temperature: number): string => `${temperature.toFixed(1)}°C`;

enum UVILevel {
	NoDanger = 0,
	Danger = 3,
	HighDanger = 6,
	VeryHighDanger = 8,
	ExtremeDanger = 10
}

enum UVIColors {
	NoDanger = '#0ac947',
	Danger = '#fff700',
	HighDanger = '#f78d23',
	VeryHighDanger = '#e6540b',
	ExtremeDanger = '#ff2424'
}

enum UVILabels {
	NoDanger = 'Bezpieczny',
	Danger = 'Podwyższony',
	HighDanger = 'Niebezpieczny',
	VeryHighDanger = 'Bardzo niebezpieczny',
	ExtremeDanger = 'Ekstremalny'
}

export const formatUVI = (uvi: number) => {
	const levelsArray = Object.values(UVILevel).filter((s) => typeof s !== 'string') as number[];

	let currentUviLevelIndex = 0;

	for (let i = 1; i < levelsArray.length; i++) {
		if (uvi < levelsArray[i]) {
			break;
		}

		currentUviLevelIndex = i;
	}

	return {
		color: Object.values(UVIColors)[currentUviLevelIndex],
		label: Object.values(UVILabels)[currentUviLevelIndex]
	};
};

export const formatUnixTimestamp = (timestamp: number) => format(fromUnixTime(timestamp), 'HH:mm');
