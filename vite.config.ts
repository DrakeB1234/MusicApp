import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [
		sveltekit(),
		basicSsl(),
		// process.env.NODE_ENV === 'production' && visualizer({
		// 	open: true,
		// 	filename: 'stats/chunk-analysis.html',
		// 	gzipSize: true,
		// 	brotliSize: true,
		// }),
	],
});
