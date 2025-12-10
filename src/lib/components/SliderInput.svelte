<script lang="ts">
	interface Props {
		value?: number;
		label?: string;
		min?: number;
		max?: number;
		step?: number;
	}

	let { value = $bindable(50), min = 0, max = 100, step = 1, label = '' }: Props = $props();

	// Use local value for local state change, once slider is done (onChange), then update parent binded value
	let localValue: number = $state(value);

	function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
		localValue = Number(e.currentTarget.value);
	}

	function handleChange() {
		value = localValue;
	}
	function handleIncrement() {
		value += step;
		localValue += step;
	}
	function handleDecrement() {
		value -= step;
		localValue -= step;
	}
</script>

<div class="slider-container">
	<input
		type="range"
		value={localValue}
		oninput={handleInput}
		onchange={handleChange}
		{min}
		{max}
		{step}
		id="range-input"
		class="custom-slider"
	/>
	<div class="buttons-container">
		<button class="secondary" onclick={handleDecrement}>-</button>
		<p class="body-large">{localValue} {label}</p>
		<button class="secondary" onclick={handleIncrement}>+</button>
	</div>
</div>

<style>
	.slider-container {
		display: block;
		padding: var(--space-4);
		max-width: 400px;
		margin-inline: auto;
	}

	.buttons-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: var(--space-1);
		text-align: center;
	}

	.custom-slider {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		width: 100%;
		background: transparent;
		cursor: pointer;
	}

	.custom-slider::-webkit-slider-runnable-track {
		height: 10px;
		background: var(--color-surface-xdark);
		border-radius: var(--radius-md);
	}

	.custom-slider::-moz-range-track {
		height: 10px;
		background: var(--color-surface-xdark);
		border-radius: var(--radius-md);
	}

	.custom-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		margin-top: -8px;
		width: 1.5rem;
		height: 1.5rem;
		background: var(--color-on-surface);
		border-radius: var(--radius-full);
		transition: var(--transition-color);
	}

	.custom-slider::-moz-range-thumb {
		width: 1.5rem;
		height: 1.5rem;
		background: var(--color-on-surface);
		border-radius: var(--radius-full);
		border: none;
	}

	.custom-slider:focus::-webkit-slider-thumb {
		background: var(--color-primary);
	}

	.custom-slider:focus::-moz-range-thumb {
		background: var(--color-primary);
	}
</style>
