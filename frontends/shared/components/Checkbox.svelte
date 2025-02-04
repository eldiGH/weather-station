<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		checked?: boolean;
		children?: Snippet;
	}

	let { checked = $bindable(false), children }: Props = $props();
</script>

<label class="checkbox-container">
	<input bind:checked type="checkbox" />
	<div class="checkbox">
		<svg fill="none" viewBox="0 0 24 24" class="checkbox-icon">
			<path
				stroke-linejoin="round"
				stroke-linecap="round"
				stroke-width="3"
				stroke="currentColor"
				d="M4 12L10 18L20 6"
				class="checkbox-tick-path"></path>
		</svg>
	</div>
	{#if children}
		<div>
			{@render children()}
		</div>
	{/if}
</label>

<style lang="scss">
	$animationParams: 0.15s ease-in-out;

	.checkbox-container {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		cursor: pointer;
		user-select: none;

		& input {
			position: absolute;
			width: 0;
			height: 0;
			padding: 0;
			margin: 0;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			border: 0;

			&:focus + .checkbox {
				outline: 3px solid var(--primary-color);
				outline-offset: -1px;
			}
		}

		.checkbox {
			position: relative;
			width: 1.5rem;
			height: 1.5rem;
			border-radius: 4px;
			transition:
				transform $animationParams,
				background-color $animationParams;

			background-color: white;
			border: 2px solid var(--primary-color);

			&-icon {
				position: absolute;
				inset: 0;
				margin: auto;
				width: 80%;
				height: 80%;
				color: var(--primary-color);
				transform: scale(1);
				transition:
					stroke-dashoffset $animationParams,
					color $animationParams;
			}

			&-tick-path {
				stroke-dasharray: 25;
				stroke-dashoffset: 25;
				transition: stroke-dashoffset $animationParams;
			}
		}

		input:checked + .checkbox {
			background: var(--primary-color);
			border-color: var(--primary-color);

			& .checkbox-icon {
				transform: scale(1);
				color: white;
			}

			& .checkbox-tick-path {
				stroke-dashoffset: 0;
			}
		}

		&:hover .checkbox {
			transform: scale(1.1);
		}

		&:active .checkbox {
			transform: scale(0.95);
			outline: 3px solid var(--primary-color);
			outline-offset: -1px;
		}
	}
</style>
