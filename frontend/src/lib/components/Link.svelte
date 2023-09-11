<script lang="ts">
	let className: string | undefined = undefined;
	export { className as class };

	export let noColor: undefined | boolean = undefined;
	export let href: string;
</script>

<a class:color={!noColor} class:without-color={noColor} class={className} {href}><slot /></a>

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
