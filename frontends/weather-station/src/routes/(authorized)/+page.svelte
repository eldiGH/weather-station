<script lang="ts">
	import { Select } from '@shared/ui/components';

	const options = [
		{ label: 'Option1', value: null },
		{ label: 'Option2', value: null },
		{ label: 'Option3', value: null },
		{ label: 'Option4', value: null },
		{ label: 'Option5', value: null },
		{ label: 'Option6', value: null }
	];

	let selectedOption = $state(options[0]);

	$inspect(selectedOption);
</script>

<Select bind:value={selectedOption} {options} />
