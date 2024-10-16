<script lang="ts">
	import type { HTMLButtonAttributes, MouseEventHandler } from 'svelte/elements';
	import Ripple, { type ShowRippleFn } from './Ripple.svelte';
	import Spinner from './Spinner.svelte';
	import type { Snippet } from 'svelte';
	import type { IconType } from '@shared/types/IconType';
	import Icon from './Icon.svelte';

	interface Props extends HTMLButtonAttributes {
		busy?: boolean;
		ripple?: boolean;
		style?: string;
		disabled?: boolean;
		children: Snippet;
		href?: string;
		icon?: IconType;
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
		...restProps
	}: Props = $props();

	const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
		if (ripple) {
			showRipple?.(e);
		}

		onclick?.(e);
	};

	let showRipple: ShowRippleFn | undefined = $state();
</script>

{#snippet buttonContent()}
	<div class="content">
		{#if icon}
			<span>
				<Icon {icon} />
			</span>
		{/if}
		{@render children()}
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
		class="btn"
		{style}
		{href}
		onclick={(e) => {
			showRipple?.(e);
		}}
		class:busy
		class:disabled={busy || disabled}>
		{@render buttonContent()}
	</a>
{:else}
	<button
		{...restProps as HTMLButtonAttributes}
		class="btn"
		{style}
		onclick={handleClick}
		class:busy
		disabled={busy || disabled}>
		{@render buttonContent()}
	</button>
{/if}

<style lang="scss">
	.btn {
		background-color: var(--button-color);
		border: none;
		color: var(--button-text-color);
		padding: 0 1em;
		border-radius: 5px;
		font-size: 1.2rem;
		cursor: pointer;
		transition:
			filter 100ms ease-in-out,
			background-color 100ms ease-in-out;
		position: relative;
		user-select: none;
		height: 3rem;
		display: inline-flex;
		align-items: center;

		&:hover {
			filter: brightness(90%);
		}

		&:disabled,
		&.disabled {
			cursor: not-allowed;
			background-color: var(--button-disabled);

			&:hover {
				filter: none;
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
