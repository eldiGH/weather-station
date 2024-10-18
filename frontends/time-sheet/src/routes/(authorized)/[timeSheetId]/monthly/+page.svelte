<script lang="ts">
	import type { PageData } from './$types';
	import NumericInput from '@shared/components/NumericInput.svelte';
	import { format } from 'date-fns';
	import Button from '@shared/components/Button.svelte';
	import { capitalize } from '@shared/helpers/string';
	import IconButton from '@shared/components/IconButton.svelte';
	import Loader from '@shared/components/Loader.svelte';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();
	const { selectedMonth, isModified, entries } = $derived(data);

	let isSavingTimeSheet = $state(false);

	const handleSave = async () => {
		isSavingTimeSheet = true;
		await data.entries.save();
		isSavingTimeSheet = false;
	};
</script>

{#snippet timeEntry(index: number)}
	<div class="entry">
		<span>{format($entries[index].date, 'd. MMMM yyyy')}</span>
		<NumericInput
			centerText
			min={0}
			max={24}
			incButton
			decButton
			label="Czas"
			short
			disabled={isSavingTimeSheet}
			bind:value={$entries[index].hours} />
	</div>
{/snippet}

<div class="root">
	<div class="header">
		<IconButton
			iconSize={30}
			size={20}
			icon="chevron_left"
			onclick={() => data.entries.changeMonth(-1)}
			disabled={isSavingTimeSheet} />
		{capitalize(format($selectedMonth, 'LLLL yyyy'))}
		<IconButton
			iconSize={30}
			size={20}
			icon="chevron_right"
			onclick={() => data.entries.changeMonth(1)}
			disabled={isSavingTimeSheet} />
	</div>
	<div class="time-sheet">
		{#each $entries as _, i}
			{@render timeEntry(i)}
		{/each}
		<Loader sticky overlay show={isSavingTimeSheet} />
	</div>
	<div class="footer">
		<Button
			busy={isSavingTimeSheet}
			disabled={isSavingTimeSheet || !$isModified}
			onclick={handleSave}>Zapisz</Button>
	</div>
</div>

<style lang="scss">
	@use '@shared/styles/vars' as v;

	.root {
		display: flex;
		flex-direction: column;
		align-items: center;

		& .header {
			border-bottom: 1px solid black;
			width: 100%;
			padding: 1rem 1rem;
			font-size: 2rem;
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 0.5rem;
			position: sticky;
			top: v.$topBarHeight;
			z-index: 1;
			background-color: white;
			z-index: v.$loaderZIndex - 1;
		}

		.footer {
			position: sticky;
			bottom: 0;
			z-index: 1;
			background-color: white;
			display: flex;
			width: 100%;
			justify-content: center;
			padding: 1rem;
			border-top: 1px solid black;
			z-index: v.$loaderZIndex - 1;
		}

		.time-sheet {
			position: relative;
			width: 100%;
		}
	}

	.entry {
		width: 100%;
		border-bottom: 2px dotted black;
		display: flex;
		justify-content: space-around;
		height: 100px;
		align-items: center;
		padding-right: 1rem;
	}
</style>
