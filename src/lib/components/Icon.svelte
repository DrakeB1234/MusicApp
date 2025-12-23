<script lang="ts">
	type IconName =
		| 'material-connect'
		| 'material-settings'
		| 'material-left-arrow'
		| 'material-play-circle'
		| 'material-exit'
		| 'material-menu'
		| 'material-start'
		| 'material-stop'
		| 'note-recognition'
		| 'sight-reading'
		| 'rhythm-training'
		| 'chord-guesser';

	let {
		name,
		color = 'var(--color-font)',
		size = 24
	}: {
		name: IconName;
		color?: string;
		size?: number;
	} = $props();
</script>

<svg aria-hidden="true" fill={color} width={size} height={size} style="height: auto; width: auto;">
	<use href="/sprite.svg#{name}" />
</svg>
