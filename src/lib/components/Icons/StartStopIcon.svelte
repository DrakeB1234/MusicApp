<script>
	const { color = 'var(--color-on-surface)', size = 24, isStart = false } = $props();

	const START_PATH = 'M240-240v-480h480v480H240Z';
	const STOP_PATH = 'M320-200v-560l440 280-440 280Z';
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	height={size}
	width={size}
	viewBox="0 -960 960 960"
	fill={color}
>
	<path d={isStart ? START_PATH : STOP_PATH} />
</svg>
