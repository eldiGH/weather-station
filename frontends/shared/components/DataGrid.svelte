<script lang="ts">
	import { type MouseEventHandler } from 'svelte/elements';
	import { on } from 'svelte/events';
	import Icon from './Icon.svelte';

	interface Column {
		label: string;
		dataKey: string;
	}

	interface Props {
		data: Record<string, unknown>[];
		columns: Column[];
	}

	let columnsWidths: number[] = $state([]);
	let isResizingColumns: boolean = $state(false);

	let { columns, data }: Props = $props();

	let sortBy: null | { columnIndex: number; direction: 'asc' | 'desc' } = $state(null);
	let sortedData = $derived.by(() => {
		if (!sortBy) {
			return data;
		}

		const { columnIndex, direction } = $state(sortBy);
		const column = columns[columnIndex];

		return data.toSorted((a, b) => {
			const aValue = a[column.dataKey];
			const bValue = b[column.dataKey];

			if (typeof aValue === 'string' && typeof bValue === 'string') {
				return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
			}

			if (typeof aValue !== 'number' || typeof bValue !== 'number') {
				return 0;
			}

			if (aValue < bValue) {
				return direction === 'asc' ? -1 : 1;
			}

			if (aValue > bValue) {
				return direction === 'asc' ? 1 : -1;
			}

			return 0;
		});
	});

	const handleColumnResize =
		(separatorIndex: number): MouseEventHandler<HTMLDivElement> =>
		(e) => {
			e.stopPropagation();

			const separator = e.currentTarget;
			const parent = separator.parentElement;
			if (!parent) return;

			const onMouseMove = (e: MouseEvent) => {
				const newWidth = e.clientX - parent.offsetLeft + 6;
				if (newWidth <= 70) return;

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
		let direction: 'asc' | 'desc' = 'asc';

		if (sortBy && sortBy.columnIndex === columnIndex) {
			if (sortBy.direction === 'asc') {
				direction = 'desc';
			} else {
				sortBy = null;
				return;
			}

			direction = 'desc';
		}

		sortBy = { columnIndex, direction };
	};

	$effect(() => {
		columnsWidths = columns.map(() => 180);
	});
</script>

<div class="datagrid-container">
	<div class="datagrid" class:resizing={isResizingColumns}>
		<div class="header">
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
							<Icon icon="north" />
						</div>
					</div>
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<div role="separator" class="header-separator" onmousedown={handleColumnResize(i)}>
						<div class="header-separator-line"></div>
					</div>
				</div>
			{/each}
		</div>
		<div class="body">
			{#each sortedData as row, i}
				<div class="row" class:even={i % 2 === 0}>
					{#each columns as column, i}
						<div class="row-item" style:width="{columnsWidths[i]}px">
							<div title="{row[column.dataKey]} " class="row-item-text">
								{row[column.dataKey]}
							</div>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.datagrid-container {
		border: 1px solid #ccc;
		border-radius: 15px;
		overflow-x: auto;
		width: min(100%, 1000px);

		.datagrid {
			display: flex;
			flex-direction: column;
			&.resizing {
				cursor: col-resize;
				user-select: none;
			}

			.header {
				display: flex;
				border-bottom: 1px solid #ccc;
				height: 60px;

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
							&.desc {
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
							border-right: 1px solid #ccc;
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
					border-bottom: 1px solid #ccc;

					&:hover {
						background-color: rgba(0, 0, 0, 0.2);
					}

					&:last-child {
						border-bottom: none;
					}

					.row-item {
						padding: 0 1rem;
						display: flex;
						align-items: center;

						&-text {
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}
				}
			}
		}
	}
</style>
