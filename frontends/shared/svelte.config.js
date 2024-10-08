import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

const themeAlias = resolve(import.meta.dirname, 'styles/themes.scss');

/** @type {import('@sveltejs/kit').Config} */
export const svelteConfig = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess({
		style: {
			resolve: {
				alias: {
					'@theme': themeAlias
				}
			}
		}
	}),
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({ out: 'dist' }),
		alias: {
			'@theme': themeAlias
		}
	}
};

export default svelteConfig;
