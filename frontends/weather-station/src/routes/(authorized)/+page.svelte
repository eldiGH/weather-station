<script lang="ts">
	import { Select } from '@shared/ui/components';
</script>

<div>
	<Select
		options={[
			{ label: 'Test1', value: '' },
			{ label: 'Test2', value: '' },
			{ label: 'Test3', value: '' },
			{ label: 'Test4', value: '' },
			{ label: 'Test5', value: '' }
		]}
		value=""
		label="Testowy" />
</div>

<style>
	div {
		padding: 1rem;
		background-color: white;
		width: 400px;
	}
</style>
