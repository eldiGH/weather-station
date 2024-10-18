<script lang="ts" module>
	export type IconVariant = 'outlined' | 'sharp' | 'rounded';
</script>

<script lang="ts">
	import type { IconType } from '../types/IconType';

	interface Props {
		variant?: IconVariant;
		icon: IconType;
		filled?: boolean;
		weight?: number;
		grade?: number;
		opticalSize?: number;
		size?: number;
	}

	const {
		variant = 'outlined',
		icon,
		filled = false,
		weight = 400,
		grade = 0,
		opticalSize = 24,
		size
	}: Props = $props();
</script>

<i
	style="
	font-variation-settings:'FILL' {filled ? 1 : 0}, 
	'wght' {weight}, 
	'GRAD' ${grade}, 
	'opsz' {opticalSize};
	font-size: {size ? size + 'px' : 'inherit'}"
	class={`material-symbols-${variant}`}>{icon}</i>
