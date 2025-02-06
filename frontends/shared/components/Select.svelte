<script lang="ts" generics="T = unknown">
	import Icon from './Icon.svelte';
	import type { KeyboardEventHandler } from 'svelte/elements';
	import { onMount } from 'svelte';
	import type { SelectOption } from '../types/SelectOption';
	import { on } from 'svelte/events';
	import { portal } from '../actions/portal';
	import { slide } from 'svelte/transition';
	import { delayDestroy } from '../transitions/delayDestroy';

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

	let isOpen = $state(false);
	let ulRef = $state<HTMLUListElement | null>(null);
	let selectRef = $state<HTMLDivElement | null>(null);
	let dropdownRef = $state<HTMLDivElement | null>(null);
	let selectedOption = $state(defaultOption ? defaultOption : null);

	const close = () => {
		isOpen = false;
	};

	const open = () => {
		const buttonRect = selectRef?.getBoundingClientRect();
		if (!buttonRect || !dropdownRef) {
			return;
		}

		dropdownRef.style.top = `${buttonRect.bottom}px`;
		dropdownRef.style.left = `${buttonRect.left}px`;

		isOpen = true;
	};

	const toggle = () => {
		if (isOpen) {
			close();
		} else {
			open();
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

	const handleSelectKeydown: KeyboardEventHandler<HTMLDivElement> = (e) => {
		if (e.key === 'Escape') {
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
		} else if (e.key === 'Enter') {
			open();
		} else {
			return;
		}

		e.preventDefault();
	};

	const handleClickOutside = (e: MouseEvent) => {
		if (
			dropdownRef &&
			!dropdownRef.contains(e.target as Node) &&
			selectRef &&
			!selectRef.contains(e.target as Node)
		) {
			close();
		}
	};

	onMount(() => {
		const off = on(document, 'click', handleClickOutside);

		return () => {
			off();
		};
	});
</script>

<div
	role="button"
	tabindex="0"
	bind:this={selectRef}
	class="select"
	class:open={isOpen}
	onclick={toggle}
	onkeydown={handleSelectKeydown}>
	<div class="selected-option">{selectedOption?.label}</div>
	<div class="open-dropdown-icon">
		<Icon icon="expand_circle_down" />
	</div>
	<div class="label" class:raised={!!selectedOption}>
		{label}
		{#if required}
			<span>*</span>
		{/if}
	</div>
</div>

<div bind:this={dropdownRef} class="dropdown-container" class:close={!isOpen}>
	{#if isOpen}
		<div transition:delayDestroy={{ duration: 400 }} class="dropdown">
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
		padding: 0;
		border: none;
		border-bottom: 1px solid var(--input-inactive-border);
		background-color: transparent;
		color: black;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		user-select: none;
		font-size: 1rem;

		position: relative;

		max-width: 220px;
		width: 100%;

		transition: border-color $animationOpts;

		&:focus {
			outline: 2px solid var(--primary-color);
			outline-offset: 2px;
		}

		.selected-option {
			overflow-x: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			text-align: start;
			flex-grow: 1;
			padding: 0 0.5rem;
		}

		.label {
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
		}

		.open-dropdown-icon {
			display: inline-flex;
			transition:
				transform $animationOpts,
				color $animationOpts;
		}

		&.open {
			border-color: var(--input-border);

			.open-dropdown-icon {
				transform: rotate(180deg);
				color: var(--input-border);
			}

			.label {
				color: var(--input-border);
			}
		}
	}

	@keyframes slide {
		0% {
			transform: translateY(-100%);
		}

		100% {
			transform: translateY(0);
		}
	}

	.dropdown {
		width: 220px;

		background: none;
		border: none;

		animation: slide 400ms cubic-bezier(0.4, 0, 0.2, 1) normal;

		z-index: v.$loaderZIndex + 100;

		&-container.close > & {
			animation-direction: reverse;
		}

		&-container {
			overflow-y: hidden;
			position: absolute;
		}

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
</style>
