// @ts-expect-error Throws for some reason
import eslint from '@eslint/js';
// @ts-expect-error Throws for some reason
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
				svelteFeatures: {
					experimentalGenerics: true
				}
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	},
	{
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					args: 'all',
					argsIgnorePattern: '(^_)|(^\\$\\$Props)',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '(^_)|(^\\$\\$Props)',
					destructuredArrayIgnorePattern: '(^_)|(^\\$\\$Props)',
					varsIgnorePattern: '(^_)|(^\\$\\$Props)',
					ignoreRestSiblings: true
				}
			]
		}
	}
);
