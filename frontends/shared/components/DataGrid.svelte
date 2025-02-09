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

	let { columns, data }: Props = $props();

	const handleColumnResize =
		(separatorIndex: number): MouseEventHandler<HTMLDivElement> =>
		(e) => {
			const separator = e.currentTarget;
			const parent = separator.parentElement;
			if (!parent) return;

			const onMouseMove = (e: MouseEvent) => {
				const newWidth = e.clientX - parent.offsetLeft + 1;
				if (newWidth < 40) return;

				columnsWidths[separatorIndex] = newWidth;
			};

			const onMouseUp = () => {
				mouseMoveOff();
				mouseUpOff();
			};

			const mouseMoveOff = on(window, 'mousemove', onMouseMove);
			const mouseUpOff = on(window, 'mouseup', onMouseUp);
		};

	$effect(() => {
		columnsWidths = columns.map(() => 80);
	});
</script>

<div class="datagrid">
	<div class="header">
		{#each columns as column, i}
			<div role="columnheader" style:width="{columnsWidths[i]}px" class="header-item">
				<div class="header-item-label">
					{column.label}
				</div>
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<div role="separator" class="header-separator" onmousedown={handleColumnResize(i)}></div>
			</div>
		{/each}
	</div>
	<div class="body">
		{#each data as row}
			<div class="row">
				{#each columns as column, i}
					<div class="row-item" style:width="{columnsWidths[i]}px">{row[column.dataKey]}</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.datagrid {
		display: flex;
		flex-direction: column;

		.header {
			display: flex;
			border-bottom: 1px solid #ccc;

			.header-item {
				display: flex;
				justify-content: space-between;

				.header-item-label {
					padding: 1rem;
					overflow: hidden;
				}

				.header-separator {
					cursor: col-resize;
					padding-left: 0.2rem;
					border-right: 1px solid #ccc;
				}
			}
		}

		.row {
			display: flex;

			.row-item {
				overflow: hidden;
				display: flex;
				align-self: center;
				padding: 0 1rem;
			}
		}
	}
</style>
