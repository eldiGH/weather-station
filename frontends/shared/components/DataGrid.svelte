<script lang="ts">
	interface Column {
		label: string;
		dataKey: string;
	}

	interface Props {
		data: Record<string, unknown>[];
		columns: Column[];
	}

	let { columns, data }: Props = $props();
</script>

<div class="datagrid">
	<div class="header">
		{#each columns as column, i}
			<div class="header-item">{column.label}</div>
			{#if i !== columns.length - 1}
				<div class="header-separator"></div>
			{/if}
		{/each}
	</div>
	<div class="body">
		{#each data as row}
			<div>
				{#each columns as column}
					<div>{row[column.dataKey]}</div>
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
				padding: 1rem;
			}

			.header-separator {
				border-right: 1px solid #ccc;
			}
		}
	}
</style>
