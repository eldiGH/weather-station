import { stat, readdir, open } from 'fs/promises';
import { join, resolve } from 'path';

const directories = ['components', 'helpers', 'stores', 'pages', 'types'];

const importDefaultPatterns = [/\.svelte$/];
const extensionsToBeCutPatterns = [/\.ts$/];

const EXTENSION_REGEX = /\.\w+$/;

const addIndexForDir = async (directory: string) => {
	const dirPath = resolve(directory);
	const items = await readdir(dirPath);

	const indexFile = await open(join(dirPath, 'index.ts'), 'w');

	for (const item of items) {
		if (item === 'index.ts') {
			continue;
		}

		const itemStat = await stat(join(dirPath, item));
		const isDirectory = itemStat.isDirectory();

		if (isDirectory) {
			addIndexForDir(join(dirPath, item));
		}

		const importFrom = extensionsToBeCutPatterns.some((pattern) => pattern.test(item))
			? item.replace(EXTENSION_REGEX, '')
			: item;

		let importLine;
		if (importDefaultPatterns.some((pattern) => pattern.test(item))) {
			const itemWithoutExtension = isDirectory ? item : item.replace(EXTENSION_REGEX, '');

			importLine = `export { default as ${itemWithoutExtension} } from './${importFrom}';\n`;
		} else {
			importLine = `export * from './${importFrom}';\n`;
		}

		indexFile.appendFile(importLine);
	}

	await indexFile.close();
};

directories.forEach(addIndexForDir);
