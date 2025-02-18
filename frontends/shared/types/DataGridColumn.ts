import type { Snippet } from 'svelte';

export interface DataGridColumn<T extends Record<string, unknown>, K extends keyof T> {
	label: string;
	dataKey: K;
	dataFormatter?: (value: T[K]) => string;
	snippet?: Snippet<[T[K], T]>;
	sortable?: boolean;
	resizable?: boolean;
}

type MakeCol<T extends Record<string, unknown>> = <const K extends keyof T>(
	col: DataGridColumn<T, K>
) => DataGridColumn<T, K>;

export const dataGridColumns = <
	T extends Record<string, unknown>,
	Cols extends DataGridColumn<T, any>[]
>(
	_data: T[],
	columnFactory: (col: MakeCol<T>) => Cols
): Cols => {
	return columnFactory((c) => c);
};
