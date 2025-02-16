<script lang="ts" module>
	export interface DataGridColumn<T extends Record<string, unknown>> {
		label: string;
		dataKey: keyof T;
		dataFormatter?: (value: T[keyof T]) => string;
	}
</script>

<script lang="ts" generics="Data extends Record<string, unknown>">
	import { type MouseEventHandler } from 'svelte/elements';
	import { on } from 'svelte/events';
	import Icon from './Icon.svelte';
	import { isDate } from 'date-fns';
	import { onMount } from 'svelte';

	interface Props {
		data: Data[];
		columns: DataGridColumn<Data>[];
	}

	const MINIMUM_COLUMN_WIDTH = 70;
	const AUTO_RESIZE_ROW_PADDING = 33;
	const AUTO_RESIZE_HEADER_PADDING = 35;
	const MAXIMUM_INITIAL_WIDTH = 300;

	let columnsWidths: number[] = $state([]);
	let isResizingColumns: boolean = $state(false);

	let containerWidth = $state(0);

	let rowFillerWidth = $derived.by(() => {
		const sum = columnsWidths.reduce((acc, width) => acc + width, 0);
		return Math.max(containerWidth - sum, 0);
	});

	let { columns, data }: Props = $props();

	type FormattedData = Record<
		keyof Data,
		{ formattedValue: string; align: 'left' | 'right' | 'center'; value: unknown }
	>;

	let sortBy: null | { columnIndex: number; direction: 'asc' | 'desc' } = $state(null);
	let formattedData = $derived.by(() =>
		data.map((row) =>
			columns.reduce<FormattedData>((acc, column) => {
				const value = row[column.dataKey];

				if (column.dataFormatter) {
					acc[column.dataKey] = {
						formattedValue: column.dataFormatter(value),
						align: 'left',
						value
					};
					return acc;
				}

				let formattedValue = '';
				let alignment: FormattedData[string]['align'] = 'left';

				switch (typeof value) {
					case 'string': {
						formattedValue = value.trim();
						break;
					}
					case 'number':
					case 'bigint': {
						formattedValue = value.toLocaleString(undefined, { useGrouping: true });
						alignment = 'right';
						break;
					}
					case 'boolean': {
						formattedValue = value ? 'True' : 'False';
						break;
					}
					default: {
						if (isDate(value)) {
							formattedValue = value.toLocaleString(undefined, {
								dateStyle: 'short',
								timeStyle: 'short'
							});
							break;
						}

						formattedValue = '-';
						alignment = 'center';
						break;
					}
				}

				acc[column.dataKey] = {
					formattedValue,
					align: alignment,
					value
				};
				return acc;
			}, {} as FormattedData)
		)
	);

	let sortedData = $derived.by(() => {
		if (!sortBy) {
			return formattedData;
		}

		const { columnIndex } = $state(sortBy);
		const column = columns[columnIndex];

		const sortedData = formattedData.toSorted((a, b) => {
			const aValue = a[column.dataKey].value;
			const bValue = b[column.dataKey].value;

			if (typeof aValue === 'string' && typeof bValue === 'string') {
				return aValue.localeCompare(bValue);
			}

			if (isDate(aValue) && isDate(bValue)) {
				aValue.getTime() - bValue.getTime();
			}

			if (typeof aValue === 'number' && typeof bValue === 'number') {
				return aValue - bValue;
			}

			const isANullish = aValue === null || aValue === undefined;
			const isBNullish = bValue === null || bValue === undefined;

			if (isANullish && isBNullish) {
				return 0;
			} else if (isANullish) {
				return -1;
			} else if (isBNullish) {
				return 1;
			}

			return 0;
		});

		if (sortBy.direction === 'desc') {
			sortedData.reverse();
		}

		return sortedData;
	});

	$inspect({ sortedData });

	const handleColumnResize =
		(separatorIndex: number): MouseEventHandler<HTMLDivElement> =>
		(e) => {
			const separator = e.currentTarget;
			const parent = separator.parentElement;
			if (!parent) return;

			const onMouseMove = (e: MouseEvent) => {
				const { x } = parent.getBoundingClientRect();

				const newWidth = e.clientX - x + 6;
				if (newWidth <= MINIMUM_COLUMN_WIDTH) return;

				columnsWidths[separatorIndex] = newWidth;
			};

			const onMouseUp = () => {
				mouseMoveOff();
				mouseUpOff();
				isResizingColumns = false;
			};

			isResizingColumns = true;
			const mouseMoveOff = on(window, 'mousemove', onMouseMove);
			const mouseUpOff = on(window, 'mouseup', onMouseUp);
		};

	const handleSort = (columnIndex: number) => {
		let direction: 'asc' | 'desc' = 'desc';

		if (sortBy && sortBy.columnIndex === columnIndex) {
			if (sortBy.direction === 'desc') {
				direction = 'asc';
			} else {
				sortBy = null;
				return;
			}

			direction = 'asc';
		}

		sortBy = { columnIndex, direction };
	};

	let bodyRef: HTMLDivElement | null = $state(null);
	let headerRef: HTMLDivElement | null = $state(null);

	const getColumnIdealWidth = (columnIndex: number) => {
		if (!bodyRef || !headerRef) return MINIMUM_COLUMN_WIDTH;

		let columnMaxWidth = MINIMUM_COLUMN_WIDTH - AUTO_RESIZE_ROW_PADDING;

		const headerWidth =
			headerRef.children[columnIndex]?.firstElementChild?.firstElementChild?.scrollWidth;

		for (let row of bodyRef.children) {
			const column = row.children[columnIndex]?.children[0];
			if (!column) {
				continue;
			}

			if (column.scrollWidth > columnMaxWidth) {
				columnMaxWidth = column.scrollWidth;
			}
		}

		const columnIdealWidth = columnMaxWidth + AUTO_RESIZE_ROW_PADDING;
		if (headerWidth) {
			const headerIdealWidth = headerWidth + AUTO_RESIZE_HEADER_PADDING;
			return Math.max(columnIdealWidth, headerIdealWidth);
		}

		return columnIdealWidth;
	};

	const handleColumnAutoResize = (columnIndex: number) => () => {
		const idealWidth = getColumnIdealWidth(columnIndex);
		columnsWidths[columnIndex] = idealWidth;
	};

	const autoResizeAllColumns = () => {
		for (let [i] of columns.entries()) {
			const width = getColumnIdealWidth(i);
			if (width === null) {
				continue;
			}

			columnsWidths[i] = Math.min(width, MAXIMUM_INITIAL_WIDTH);
		}
	};

	$effect(() => {
		columnsWidths = columns.map(() => 120);
	});

	onMount(() => {
		setTimeout(autoResizeAllColumns, 5);
	});
</script>

<div class="root">
	<div class="datagrid-container" bind:clientWidth={containerWidth}>
		<div class="datagrid" class:resizing={isResizingColumns}>
			<div class="header" bind:this={headerRef}>
				{#each columns as column, i}
					<div style:width="{columnsWidths[i]}px" class="header-item">
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<div
							role="columnheader"
							class="header-item-content"
							onclick={() => handleSort(i)}
							title={column.label}
							tabindex="0">
							<div class="header-item-label">
								{column.label}
							</div>
							<div
								class="header-item-sort"
								class:asc={i === sortBy?.columnIndex && sortBy?.direction === 'asc'}
								class:desc={i === sortBy?.columnIndex && sortBy?.direction === 'desc'}>
								<Icon icon="south" />
							</div>
						</div>
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
						<div
							role="separator"
							class="header-separator"
							onmousedown={handleColumnResize(i)}
							ondblclick={handleColumnAutoResize(i)}>
							<div class="header-separator-line"></div>
						</div>
					</div>
				{/each}
				<div style:width="{rowFillerWidth}px"></div>
			</div>
			<div class="body" bind:this={bodyRef}>
				{#each sortedData as row, i}
					<div class="row" class:even={i % 2 === 0}>
						{#each columns as column, i}
							<div
								class="row-item"
								style:width="{columnsWidths[i]}px"
								style:justify-content={row[column.dataKey].align}>
								<div title={row[column.dataKey]?.toString()} class="row-item-content">
									{row[column.dataKey].formattedValue}
								</div>
							</div>
						{/each}
						<div style:width="{rowFillerWidth}px"></div>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div class="border-bottom"></div>
</div>

<style lang="scss">
	$border-radius: 10px;
	$border-color: #707070;

	.root {
		width: min(1000px, 100%);

		.datagrid-container {
			border: 1px solid $border-color;
			border-radius: $border-radius;
			border-bottom-right-radius: 0;
			border-bottom-left-radius: 0;
			border-bottom: none;
			overflow-x: auto;
			flex-grow: 1;
			width: 100%;

			.datagrid {
				display: flex;
				flex-direction: column;
				&.resizing {
					cursor: col-resize;
					user-select: none;
				}

				.header {
					display: flex;
					border-bottom: 1px solid $border-color;
					height: 60px;
					width: fit-content;

					.header-item {
						display: flex;
						align-items: center;
						cursor: pointer;

						.header-item-content {
							flex-grow: 1;
							display: inline-flex;
							height: 100%;
							align-items: center;
							min-width: 0;

							.header-item-label {
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
								padding-left: 1rem;
							}

							&:hover .header-item-sort {
								opacity: 0.5;
							}

							.header-item-sort {
								font-size: 1.5rem;
								opacity: 0;
								transition:
									opacity 0.2s ease-in-out,
									transform 0.2s ease-in-out;

								&.asc,
								&.desc {
									opacity: 1 !important;
								}
								&.asc {
									transform: rotate(180deg);
								}
							}
						}

						.header-separator {
							cursor: col-resize;
							padding: 0 0.3rem;
							display: flex;
							align-items: center;
							justify-content: space-around;

							position: relative;

							height: 100%;

							&:hover .header-separator-line,
							&:active .header-separator-line {
								outline: 2px solid var(--primary-color);
							}

							&-line {
								border-right: 1px solid $border-color;
								height: 50%;
								border-radius: 5px;
								outline-offset: 2px;
							}
						}
					}
				}

				.body {
					.row {
						display: flex;
						padding: 0.5rem 0;
						height: 60px;
						border-bottom: 1px solid $border-color;
						width: fit-content;

						&:hover {
							background-color: rgba(0, 0, 0, 0.2);
						}

						.row-item {
							padding: 0 1rem;
							display: flex;
							align-items: center;

							&-content {
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
							}
						}
					}
				}
			}
		}

		.border-bottom {
			border: 1px solid $border-color;
			border-top: none;
			border-radius: $border-radius;
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			padding-top: $border-radius;
			width: 100%;
		}
	}
</style>
