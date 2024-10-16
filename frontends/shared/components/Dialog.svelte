<script lang="ts">
	import type { Snippet } from 'svelte';
	import IconButton from './IconButton.svelte';
	import { fade, slide } from 'svelte/transition';
	import Button from './Button.svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	interface Props {
		title?: string;
		children?: Snippet;
		footer?: Snippet;
		show?: boolean;
		textContent?: string;
		closeButtonLabel?: string;
		variant?: 'info' | 'warning' | 'danger';
		disableCloseButtons?: boolean;
	}

	let {
		children,
		title,
		show = $bindable(),
		footer,
		closeButtonLabel,
		variant = 'info',
		disableCloseButtons
	}: Props = $props();

	const handleClose: MouseEventHandler<HTMLElement> = (e) => {
		e.preventDefault();
		show = false;
	};
</script>

{#if show}
	<div class="dialog-disable-scroll"></div>
{/if}

{#if show}
	<div transition:fade class="overlay"></div>
	<div transition:slide class="dialog-container">
		<div class="dialog {variant}">
			<div class="title">
				<div>{title}</div>
				<IconButton
					disabled={disableCloseButtons}
					onclick={handleClose}
					size={20}
					square
					icon="close" />
			</div>
			{#if children}
				<div class="content">
					{@render children()}
				</div>
			{/if}
			<div class="footer">
				<Button disabled={disableCloseButtons} onclick={handleClose}>
					{#if closeButtonLabel}
						{closeButtonLabel}
					{:else}
						Zamknij
					{/if}
				</Button>
				{#if footer}
					{@render footer()}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	@use '../styles/vars' as v;

	.overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.1);
		z-index: v.$loaderZIndex - 1;
	}

	:global(body:has(div.dialog-disable-scroll)) {
		overflow: hidden;
	}

	.dialog {
		background-color: white;
		border-radius: 15px;
		overflow: hidden;

		width: 400px;

		&-container {
			z-index: v.$loaderZIndex - 1;
			position: fixed;
			inset: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.title {
			width: 100%;
			background-color: var(--primary-color);
			color: white;
			padding: 0.5rem 0.5rem 0.5rem 1rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 1.4rem;
			font-weight: bold;
		}

		.text-content {
			padding: 1rem;
		}

		.footer {
			border-top: 1px solid black;
			background-color: white;
			padding: 0.5rem;
			display: flex;
			justify-content: flex-end;
			gap: 1rem;
		}

		.content {
			padding: 1rem;
		}

		&.danger {
			:global(.btn) {
				--button-color: #ffa600;
			}

			.title {
				background-color: #ffa600;
			}
		}
	}
</style>
