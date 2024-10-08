<script lang="ts">
	export let value: string;
	export let x: number;
	export let y: number;
</script>

<text transform="translate(0, 16)" text-anchor="middle" fill="white" font-size="32px" {x} {y}
	>{value}</text>

<style lang="scss">
	text {
		text-shadow:
			-1px -1px 0 #000,
			1px -1px 0 #000,
			-1px 1px 0 #000,
			1px 1px 0 #000;
	}
</style>
