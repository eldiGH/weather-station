<script lang="ts">
	import type { Snippet } from 'svelte';
	import IconButton from './IconButton.svelte';
	import { fade, type TransitionConfig } from 'svelte/transition';
	import Button from './Button.svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { cubicInOut } from 'svelte/easing';

	interface Props {
		title?: string;
		children?: Snippet;
		footer?: Snippet;
		open?: () => void;
		close?: () => void;
		textContent?: string;
		closeButtonLabel?: string;
		variant?: 'normal' | 'warning' | 'danger';
		disableCloseButtons?: boolean;
		onClose?: () => void;
		onClosed?: () => void;
		onOpen?: () => void;
	}

	let {
		children,
		title,
		open = $bindable(),
		close = $bindable(),
		footer,
		closeButtonLabel = 'Zamknij',
		variant = 'normal',
		disableCloseButtons,
		onClose,
		onClosed,
		onOpen
	}: Props = $props();

	let show = $state(false);

	open = () => {
		onOpen?.();
		show = true;
	};

	close = () => {
		onClose?.();
		show = false;
	};

	const handleClose: MouseEventHandler<HTMLElement> = (e) => {
		e.preventDefault();
		show = false;
	};

	const dialogSlide = (node: HTMLDivElement): TransitionConfig => {
		const height = node.clientHeight;
		const viewportHeight = window.innerHeight - node.offsetTop;

		const translatePercentage = (viewportHeight / height) * 100;

		return {
			duration: 400,
			css: (_, u) => `transform: translateY(${translatePercentage * cubicInOut(u)}%)`
		};
	};

	const emitOnClosed = (_: Element) => {
		return {
			destroy: () => {
				onClosed?.();
			}
		};
	};
</script>

{#if show}
	<div class="dialog-disable-scroll"></div>
{/if}

{#if show}
	<div transition:fade class="overlay"></div>
	<div class="dialog-container">
		<div transition:dialogSlide class="dialog {variant}" use:emitOnClosed>
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
				<Button outlined disabled={disableCloseButtons} onclick={handleClose}>
					{#if closeButtonLabel}
						{closeButtonLabel}
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
		background-color: rgba(0, 0, 0, 0.3);
		z-index: v.$loaderZIndex - 1;
	}

	:global(body:has(div.dialog-disable-scroll)) {
		overflow: hidden;
	}

	.dialog {
		background-color: white;
		width: min(100%, 600px);

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
