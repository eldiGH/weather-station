<script lang="ts" context="module">
	export type IconVariant = 'outlined' | 'sharp' | 'rounded';
</script>

<script lang="ts">
	import type { IconType } from '$lib/types/IconType';

	export let variant: IconVariant = 'outlined';
	export let icon: IconType;

	export let filled = false;
	export let weight = 400;
	export let grade = 0;
	export let opticalSize = 24;
</script>

<i
	style={`font-variation-settings:'FILL' ${
		filled ? 1 : 0
	}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`}
	class={`material-symbols-${variant}`}>{icon}</i
>
