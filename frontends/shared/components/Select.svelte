<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import Icon from './Icon.svelte';
	import type { KeyboardEventHandler, MouseEventHandler } from 'svelte/elements';
	import { onDestroy, onMount } from 'svelte';

	interface Props {
		value: Option | null;
		notSelectedLabel?: string;
		options: Option[];
	}

	interface Option {
		label: string;
		value: unknown;
	}

	let { value = $bindable(null), notSelectedLabel, options }: Props = $props();

	let isOpen = $state(true);
	let ulRef = $state<HTMLUListElement | null>(null);
	let containerRef = $state<HTMLDivElement | null>(null);

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

	const selectOption = (option: Option) => {
		value = option;
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
		document.addEventListener('click', handleClickOutside);
	});

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside);
	});
</script>

<div bind:this={containerRef} class="select-container" class:open={isOpen}>
	<button class="select" onkeydown={handleSelectKeydown} onclick={toggle}>
		<div class="select-selected-option">
			{#if value !== null}
				{value.label}
			{:else}
				<span class="select-no-option">{notSelectedLabel ?? 'Wybierz'}</span>
			{/if}
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
	.select {
		width: 10rem;
		padding: 0.3rem 0.5rem;
		border: 2px solid var(--primary-color);
		border-radius: 5px;
		background-color: white;
		color: black;
		cursor: pointer;
		display: inline-flex;
		justify-content: space-between;
		align-items: center;
		user-select: none;
		font-size: 1rem;

		&-dropdown-icon {
			display: inline-flex;
			transition: transform 200ms ease-in-out;
		}

		.open &-dropdown-icon {
			transform: rotate(180deg);
		}

		&-container {
			display: inline-flex;
			flex-direction: column;
			position: relative;
		}

		&-no-option {
			opacity: 0.2;
		}

		&-dropdown {
			position: absolute;
			top: 100%;
			display: inline-flex;
			flex-direction: column;
			width: 10rem;

			&::before {
				content: '';

				align-self: flex-end;
				margin-right: 0.5rem;
				margin-top: 0.1rem;

				width: 0;

				border-left: 10px solid transparent;
				border-right: 10px solid transparent;

				border-bottom: 15px solid white;
			}

			ul {
				background-color: white;
				color: black;

				overflow-y: auto;

				border-radius: 5px;

				margin: 0;
				padding: 0;

				list-style: none;

				max-height: 10rem;

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
			}
		}
	}
</style>
