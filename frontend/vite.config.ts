import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import config from './src/config.json';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		proxy: {
			'^/trpc/*': {
				target: config.serverAddress,
				rewrite: (path) => path.replace('/trpc', '')
			},
			'^/trpcws/*': {
				target: config.serverAddress.replace('http', 'ws'),
				rewrite: (path) => path.replace('/trpcws', ''),
				ws: true
			}
		}
	}
});
