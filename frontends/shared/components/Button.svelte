<script lang="ts">
	import type { HTMLButtonAttributes, MouseEventHandler } from 'svelte/elements';
	import Ripple from './Ripple.svelte';
	import Spinner from './Spinner.svelte';
	import type { ComponentProps, Snippet } from 'svelte';
	import type { IconType } from '../types/Icon';
	import Icon from './Icon.svelte';

	interface Props extends HTMLButtonAttributes {
		busy?: boolean;
		ripple?: boolean;
		style?: string;
		disabled?: boolean;
		children?: Snippet;
		href?: string;
		icon?: IconType;
		variant?: 'normal' | 'danger';
		shadow?: boolean;
		outlined?: boolean;
	}

	let {
		ripple = true,
		busy = false,
		style,
		onclick,
		disabled,
		children,
		href,
		icon,
		variant = 'normal',
		shadow,
		outlined,
		...restProps
	}: Props = $props();

	const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
		if (ripple) {
			showRipple?.(e);
		}

		onclick?.(e);
	};

	let showRipple: ComponentProps<typeof Ripple>['showRipple'] = $state();
</script>

{#snippet buttonContent()}
	<div class="content">
		{#if icon}
			<span>
				<Icon {icon} />
			</span>
		{/if}
		{@render children?.()}
	</div>
	{#if busy}
		<div class="spinner">
			<Spinner size={32} />
		</div>
	{/if}
	<Ripple bind:showRipple />
{/snippet}

{#if href}
	<a
		class="btn {variant}"
		{style}
		{href}
		onclick={(e) => {
			showRipple?.(e);
		}}
		class:busy
		class:shadow
		class:disabled={busy || disabled}
		class:outlined>
		{@render buttonContent()}
	</a>
{:else}
	<button
		{...restProps as HTMLButtonAttributes}
		class="btn {variant}"
		{style}
		onclick={handleClick}
		class:busy
		class:shadow
		disabled={busy || disabled}
		class:outlined>
		{@render buttonContent()}
	</button>
{/if}

<style lang="scss">
	.btn {
		@mixin outline-shadow($color: var(--color)) {
			$outlineShadow: inset 0px 0px 0px 3px $color;

			-webkit-box-shadow: $outlineShadow;
			-moz-box-shadow: $outlineShadow;
			box-shadow: $outlineShadow;
		}

		--color: var(--button-color);

		background-color: var(--color);
		border: none;
		color: var(--button-text-color);
		padding: 0 1em;
		border-radius: 5px;
		font-size: 1.2rem;
		cursor: pointer;
		transition:
			filter 100ms ease-in-out,
			background-color 100ms ease-in-out,
			color 100ms ease-in-out;
		position: relative;
		user-select: none;
		height: 3rem;
		display: inline-flex;
		align-items: center;

		touch-action: manipulation;

		&.shadow {
			-webkit-box-shadow: 0px 0px 6px 1px rgba(66, 68, 90, 1);
			-moz-box-shadow: 0px 0px 6px 1px rgba(66, 68, 90, 1);
			box-shadow: 0px 0px 6px 1px rgba(66, 68, 90, 1);
		}

		&.danger {
			--color: #d30000;
		}

		&:hover {
			filter: brightness(90%);
		}

		&.outlined {
			background-color: transparent;

			@include outline-shadow();

			color: var(--color);

			&:hover {
				filter: none;
				background-color: var(--color);
				color: var(--button-text-color);
			}
		}

		&:disabled,
		&.disabled {
			cursor: not-allowed;
			background-color: var(--button-disabled);

			&:hover {
				filter: none;
			}

			&.outlined {
				background-color: transparent;

				@include outline-shadow(var(--button-disabled));

				color: var(--button-disabled);
			}
		}

		.spinner {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);

			display: flex;
			align-items: center;
		}

		.content {
			display: flex;
			align-items: center;

			> span {
				padding-right: 0.3rem;
				font-size: 1.5rem;
			}
		}

		&.busy {
			.content {
				visibility: hidden;
			}
		}
	}

	a {
		text-decoration: none;
		&.disabled {
			pointer-events: none;
		}
	}
</style>
