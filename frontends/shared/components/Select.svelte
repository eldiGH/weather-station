<script lang="ts" generics="T = unknown">
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import Icon from './Icon.svelte';
	import type { KeyboardEventHandler } from 'svelte/elements';
	import { onDestroy, onMount } from 'svelte';
	import type { SelectOption } from '../types/SelectOption';
	import { on } from 'svelte/events';

	interface Props {
		value: T | null;
		defaultOption?: SelectOption<T>;
		options: SelectOption<T>[];
		required?: boolean;
		label?: string;
	}

	let {
		defaultOption,
		value = $bindable(defaultOption ? defaultOption.value : null),
		options,
		label,
		required
	}: Props = $props();

	let isOpen = $state(true);
	let ulRef = $state<HTMLUListElement | null>(null);
	let containerRef = $state<HTMLDivElement | null>(null);
	let selectedOption = $state(defaultOption ? defaultOption : null);

	const toggle = () => {
		if (!isOpen) {
			open();
		} else {
			close();
		}
	};

	const close = () => {
		isOpen = false;
	};

	const open = () => {
		if (options.length > 0) {
			isOpen = true;
		}
	};

	const selectOption = (option: SelectOption<T>) => {
		selectedOption = option;
		value = option.value;
		close();
	};

	const handleListItemKeypress: KeyboardEventHandler<HTMLDivElement> = (e) => {
		const key = e.key;

		if (key === 'Enter') {
			e.currentTarget.click();
			return;
		}

		if (key === 'Escape') {
			close();
			return;
		}

		if (key !== 'ArrowDown' && key !== 'ArrowUp') {
			return;
		}

		const liElement = e.currentTarget.parentElement;
		const ulElement = liElement?.parentElement;

		if (!ulElement || !liElement) {
			return;
		}

		for (const [currentIndex, element] of ulElement.childNodes.entries()) {
			if (element !== liElement) {
				continue;
			}

			let newIndex = key === 'ArrowUp' ? currentIndex - 1 : currentIndex + 1;
			if (newIndex < 0) {
				newIndex = options.length - 1;
			} else if (newIndex > options.length - 1) {
				newIndex = 0;
			}

			const newOptionElement = ulElement.childNodes[newIndex]?.firstChild;
			if (
				newOptionElement &&
				'focus' in newOptionElement &&
				typeof newOptionElement.focus === 'function'
			) {
				newOptionElement.focus();
			}

			break;
		}
	};

	const handleSelectKeydown: KeyboardEventHandler<HTMLButtonElement> = (e) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			close();
		} else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			let element;

			if (e.key === 'ArrowUp') {
				element = ulRef?.lastElementChild?.firstChild;
			} else if (e.key === 'ArrowDown') {
				element = ulRef?.firstElementChild?.firstChild;
			}

			if (element && 'focus' in element && typeof element.focus === 'function') {
				element.focus();
			}

			e.preventDefault();
		}
	};

	const handleClickOutside = (e: MouseEvent) => {
		if (containerRef && !containerRef.contains(e.target as Node)) {
			close();
		}
	};

	onMount(() => {
		const off = on(document, 'click', handleClickOutside);

		return () => {
			off();
			console.log('off');
		};
	});

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside);
	});
</script>

<div bind:this={containerRef} class="select-container" class:open={isOpen}>
	<button class="select" onkeydown={handleSelectKeydown} onclick={toggle}>
		<div>
			{#if selectedOption}
				<div class="select-selected-option">{selectedOption.label}</div>
			{/if}
			<div class="select-label" class:raised={!!selectedOption}>
				{label}
				{#if required}
					<span>*</span>
				{/if}
			</div>
		</div>
		<div class="select-dropdown-icon">
			<Icon icon="expand_circle_down" />
		</div>
	</button>
	{#if isOpen}
		<div transition:slide={{ duration: 200, easing: cubicOut }} class="select-dropdown">
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<ul bind:this={ulRef} onkeydown={(e) => e.preventDefault()}>
				{#each options as option, i (option.label)}
					<li>
						<div
							role="button"
							onkeydown={handleListItemKeypress}
							tabindex={i === 0 ? 0 : -1}
							onclick={() => selectOption(option)}>
							{option.label}
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style lang="scss">
	@use '../styles/vars.scss' as v;

	$animationOpts: 150ms ease-in-out;

	.select {
		padding: 0.5rem 0.5rem 1px;
		border: none;
		border-bottom: 1px solid var(--input-inactive-border);
		background-color: white;
		color: black;
		cursor: pointer;
		display: inline-flex;
		justify-content: space-between;
		align-items: center;
		user-select: none;
		font-size: 1rem;

		transition: border-color $animationOpts;

		.open & {
			border-color: var(--input-border);
		}

		.select-label {
			color: var(--input-inactive-border);

			transform-origin: left;

			position: absolute;
			left: 0.4rem;
			bottom: 1px;
			pointer-events: none;
			user-select: none;

			transition: color $animationOpts;

			> span {
				color: var(--input-required-asterisk);
			}

			&.raised {
				transform: translateY(-1.1rem) scale(0.75);
			}

			.open & {
				color: var(--input-border);
			}
		}

		&-dropdown-icon {
			display: inline-flex;
			transition:
				transform $animationOpts,
				color $animationOpts;
		}

		.open &-dropdown-icon {
			transform: rotate(180deg);
			color: var(--input-border);
		}

		&-container {
			display: inline-flex;
			flex-direction: column;
			position: relative;
			width: 100%;
			max-width: 220px;
		}

		&-dropdown {
			position: absolute;
			top: 100%;
			display: inline-flex;
			flex-direction: column;
			width: 100%;

			z-index: v.$loaderZIndex - 5;

			ul {
				background-color: white;
				color: black;

				overflow-y: auto;

				border-radius: 5px;

				margin: 0;
				margin-top: 5px;
				padding: 0;

				list-style: none;

				max-height: 10rem;
				box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);

				li > div {
					padding: 0.5rem 1rem;
					cursor: pointer;
					user-select: none;

					border-bottom: 1px solid black;

					background-color: white;

					&:hover {
						background-color: var(--primary-color);
						color: white;
					}

					&:focus {
						outline: 3px solid var(--primary-color);
						outline-offset: -3px;
					}
				}

				li:last-child > div {
					border-bottom: none;
				}
			}
		}

		&-selected-option {
			overflow-x: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			width: 200px;
			text-align: start;
		}
	}
</style>
