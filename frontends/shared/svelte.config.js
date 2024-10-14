import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { join, resolve } from 'path';

const sharedPath = resolve(import.meta.dirname);
const themePath = join(sharedPath, 'styles/themes.scss');
const varsPath = join(sharedPath, 'styles/vars.scss');

/** @type {import('@sveltejs/kit').Config} */
export const svelteConfig = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess({
		style: {
			resolve: {
				alias: {
					'@shared/styles/theme': themePath,
					'@shared/styles/vars': varsPath
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
			'@shared/styles/theme': themePath,
			'@shared/styles/vars': varsPath,
			'@shared/*': sharedPath
		}
	}
};

export default svelteConfig;
