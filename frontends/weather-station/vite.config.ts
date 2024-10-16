import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vitest/config';
import config from 'frontend.shared/config.json' with { type: 'json' };

export default defineConfig({
	plugins: [sveltekit() as Promise<Plugin[]>],
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
	}
});
