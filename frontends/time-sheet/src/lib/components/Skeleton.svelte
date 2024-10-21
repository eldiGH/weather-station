<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		width?: string;
		height?: string;
		children?: Snippet;
		padding?: `${number}${'px' | 'rem'}`;
	}

	const { height, width, children, padding }: Props = $props();
</script>

<div class="skeleton" style:width style:height>
	<div class="content">
		{@render children?.()}
	</div>
	<div class="skeleton-padded" style:--padding={padding}></div>
</div>

<style lang="scss">
	@keyframes skeleton-animation {
		100% {
			transform: translateX(100%);
		}
	}

	.skeleton {
		position: relative;

		> .skeleton-padded {
			background-color: #d3d3d3;
			border-radius: 5px;

			position: absolute;
			inset: var(--padding, 10px);

			&::before {
				content: '';
				background: linear-gradient(
					90deg,
					rgba(#fff, 0) 0,
					rgba(#fff, 0.2) 20%,
					rgba(#fff, 0.5) 60%,
					rgba(#fff, 0)
				);
				display: block;
				position: absolute;
				inset: 0;

				transform: translateX(-100%);

				animation: skeleton-animation 1.3s infinite;
			}
		}

		.content {
			visibility: hidden;
		}
	}
</style>
