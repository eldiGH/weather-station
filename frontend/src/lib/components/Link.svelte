<script lang="ts">
	interface $$Props {
		href: string;
		class?: string;
		withoutColor?: boolean;
	}

	export let href: string;
</script>

<a
	class:color={!$$props.withoutColor}
	class:without-color={$$props.withoutColor}
	class={$$props.class}
	{href}><slot /></a
>

<style lang="scss">
	a,
	a:visited {
		text-decoration: none;
	}

	.color {
		color: #709dd4;
		transition: filter 100ms ease-in-out;

		&:hover {
			filter: brightness(70%);
			cursor: pointer;
		}
	}

	.without-color {
		color: inherit;
	}
</style>
