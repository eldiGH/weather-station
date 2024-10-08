import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import config from './config.json' with { type: 'json' };

export const viteConfig = defineConfig({
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
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler'
			}
		}
	},
	resolve: { alias: { themes: 'frontend.shared/styles/themes.scss' } }
});
