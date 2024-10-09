<script lang="ts">
	import Card from '@shared/components/Card.svelte';
	import type { ComponentProps } from 'svelte';
	import IconInfo from './IconInfo.svelte';

	export let data: ComponentProps<IconInfo>[];
	export let header: string;
</script>

<div class="root">
	<Card class="card">
		{header}
		<div class="data-section-container">
			<div class="data-section">
				{#each data as infoIconProps}
					<IconInfo gap={0.3} {...infoIconProps} />
				{/each}
			</div>
		</div>
	</Card>
</div>

<style lang="scss">
	.root {
		align-self: stretch;

		:global(.card) {
			padding: 2rem;
			display: inline-flex;
			flex-direction: column;
			gap: 2rem;
			font-size: 2rem;
			height: 100%;
		}

		.data-section {
			font-size: 1.2rem;
			display: flex;
			flex-direction: column;

			&-container {
				display: flex;
				flex-direction: column;
				flex-grow: 1;
				justify-content: center;
			}
		}
	}
</style>
