import { generateIndexes } from './lib';

const main = async () => {
	await generateIndexes();

	console.log('Generated all indexes successfully!');
};

main();
