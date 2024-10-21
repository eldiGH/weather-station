import { isAfter, isBefore } from 'date-fns';

export const addIntoDateSortedObjectArray = <T extends Record<string, unknown>, K extends keyof T>(
	array: T[],
	dateField: K & (T[K] extends Date | string ? K : never),
	objectToInsert: T,
	order: 'asc' | 'desc' = 'desc'
) => {
	if (array.length === 0) {
		return [objectToInsert];
	}

	const leftFunction = order === 'asc' ? isBefore : isAfter;
	const rightFunction = order === 'asc' ? isAfter : isBefore;

	const firstElementDate = array[0][dateField] as Date | string;
	const lastElementDate = array[array.length - 1][dateField] as Date | string;

	const objectDate = objectToInsert[dateField] as Date | string;

	if (leftFunction(objectDate, firstElementDate)) {
		return [objectToInsert, ...array];
	}

	if (rightFunction(objectDate, lastElementDate)) {
		return [...array, objectToInsert];
	}

	const insertionIndex = array.findIndex((item) =>
		leftFunction(objectDate, item[dateField] as string | Date)
	);

	if (insertionIndex === -1) {
		throw Error('Something went terribly wrong, did not find index to insert');
	}

	return array.toSpliced(insertionIndex, 0, objectToInsert);
};
