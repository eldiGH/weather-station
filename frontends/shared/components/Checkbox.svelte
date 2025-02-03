<label class="checkbox-container">
	<input type="checkbox" />
	<div class="checkbox">
		<svg fill="none" viewBox="0 0 24 24" class="checkbox-icon">
			<path
				stroke-linejoin="round"
				stroke-linecap="round"
				stroke-width="3"
				stroke="currentColor"
				d="M4 12L10 18L20 6"
				class="check-path"></path>
		</svg>
	</div>
</label>

<style lang="scss">
	.checkbox-container {
		display: inline-block;
		cursor: pointer;
		user-select: none;

		& input {
			display: none;
		}

		.checkbox {
			position: relative;
			width: 2rem;
			height: 2rem;
			border-radius: 8px;
			transition:
				transform 0.2s ease,
				color 0.2s ease;

			background-color: white;
			border: 2px solid #93c5fd;

			&-icon {
				position: absolute;
				inset: 0;
				margin: auto;
				width: 80%;
				height: 80%;
				color: white;
				transform: scale(0);
				transition: all 0.2s ease;
			}
		}
	}

	.check-path {
		stroke-dasharray: 40;
		stroke-dashoffset: 40;
		transition: stroke-dashoffset 0.3s ease 0.1s;
	}

	/* Checked State */
	.ios-checkbox input:checked + .checkbox-wrapper .checkbox-bg {
		background: var(--checkbox-color);
		border-color: var(--checkbox-color);
	}

	.ios-checkbox input:checked + .checkbox-wrapper .checkbox-icon {
		transform: scale(1);
	}

	.ios-checkbox input:checked + .checkbox-wrapper .check-path {
		stroke-dashoffset: 0;
	}

	/* Hover Effects */
	.ios-checkbox:hover .checkbox-wrapper {
		transform: scale(1.05);
	}

	/* Active Animation */
	.ios-checkbox:active .checkbox-wrapper {
		transform: scale(0.95);
	}

	/* Focus Styles */
	.ios-checkbox input:focus + .checkbox-wrapper .checkbox-bg {
		box-shadow: 0 0 0 4px var(--checkbox-bg);
	}
</style>
