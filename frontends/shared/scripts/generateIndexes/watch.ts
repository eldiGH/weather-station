import { directories, generateIndexesForDir } from './lib';
import * as fs from 'fs/promises';

const DEBOUNCE_TIME = 500;

const debounce = <T extends unknown[]>(callback: (...args: T) => void) => {
	let timeout: NodeJS.Timeout | null = null;

	const tick = (...args: T) => {
		timeout = null;
		callback(...args);
	};

	return (...args: T) => {
		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => tick(...args), DEBOUNCE_TIME);
	};
};

const debouncedAddIndexForDir = debounce(generateIndexesForDir);

const watch = async () => {
	directories.forEach(async (directory) => {
		const watcher = fs.watch(directory, { recursive: true });

		for await (const { filename } of watcher) {
			if (!filename || filename.endsWith('index.ts')) {
				continue;
			}

			debouncedAddIndexForDir(directory);
		}
	});
};

watch();
