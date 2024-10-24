import { stat, readdir, readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';

export const directories = ['components', 'helpers', 'stores', 'pages', 'types'].map((dir) =>
	resolve(dir)
);

interface ErrnoException extends Error {
	errno?: number | undefined;
	code?: string | undefined;
	path?: string | undefined;
	syscall?: string | undefined;
}

const isErrnoException = (error: unknown): error is ErrnoException =>
	error instanceof Error &&
	'errno' in error &&
	(typeof error.errno === 'number' || typeof error.errno === 'undefined') &&
	'code' in error &&
	(typeof error.code === 'string' || typeof error.code === 'undefined') &&
	'syscall' in error &&
	(typeof error.syscall === 'string' || typeof error.syscall === 'undefined') &&
	'path' in error &&
	(typeof error.path === 'string' || typeof error.path === 'undefined');

const importDefaultPatterns = [/\.svelte$/];
const extensionsToBeCutPatterns = [/\.ts$/];

const EXTENSION_REGEX = /\.\w+$/;

export const generateIndexesForDir = async (directory: string) => {
	const items = await readdir(directory);

	let newIndexContent = '';

	for (const item of items) {
		if (item === 'index.ts') {
			continue;
		}

		const itemStat = await stat(join(directory, item));
		const isDirectory = itemStat.isDirectory();

		if (isDirectory) {
			generateIndexesForDir(join(directory, item));
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

		newIndexContent += importLine;
	}

	const indexPath = join(directory, 'index.ts');

	try {
		const currentIndexContent = await readFile(indexPath, 'utf-8');

		if (currentIndexContent === newIndexContent) {
			return;
		}
	} catch (e) {
		if (!isErrnoException(e) || e.code !== 'ENOENT') {
			throw e;
		}
	}

	await writeFile(indexPath, newIndexContent, 'utf-8');
};

export const generateIndexes = async () =>
	Promise.all(directories.map((dir) => generateIndexesForDir(dir)));
