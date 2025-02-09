<script lang="ts">
	import { type MouseEventHandler } from 'svelte/elements';
	import { on } from 'svelte/events';

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

	const handleColumnResize =
		(separatorIndex: number): MouseEventHandler<HTMLDivElement> =>
		(e) => {
			const separator = e.currentTarget;
			const parent = separator.parentElement;
			if (!parent) return;

			const onMouseMove = (e: MouseEvent) => {
				const newWidth = e.clientX - parent.offsetLeft;
				if (newWidth < 40) return;

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

	$effect(() => {
		columnsWidths = columns.map(() => 80);
	});
</script>

<div class="datagrid" class:resizing={isResizingColumns}>
	<div class="header">
		{#each columns as column, i}
			<div
				title={column.label}
				role="columnheader"
				style:width="{columnsWidths[i]}px"
				class="header-item">
				<div class="header-item-label">
					<div class="header-item-label-text">
						{column.label}
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
		{#each data as row, i}
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

<style lang="scss">
	.datagrid {
		display: flex;
		flex-direction: column;

		border: 1px solid #ccc;

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
				justify-content: space-between;
				flex-grow: 1;

				.header-item-label {
					display: flex;
					align-items: center;

					&-text {
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						padding: 0 1rem;
					}
				}

				.header-separator {
					cursor: col-resize;
					padding: 0 0.3rem;
					display: flex;
					align-items: center;
					justify-content: space-around;

					position: relative;
					right: -6px;

					&-line {
						border-right: 1px solid #ccc;
						height: 50%;
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
</style>
