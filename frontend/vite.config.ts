import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import config from './src/config.json';
import cookie from 'cookie';
import { ClientRequest } from 'http';

const accessTokenCookieRegex = / ?;?accessToken=.*?(?:;|$) ?/;

const apiProxyHandler = (req: ClientRequest) => {
	const cookieHeader = req.getHeader('Cookie');

	if (typeof cookieHeader !== 'string') {
		return;
	}

	const { accessToken } = cookie.parse(cookieHeader);

	if (!accessToken) {
		return;
	}

	req.setHeader('Authorization', `Bearer ${accessToken}`);

	req.setHeader('Cookie', cookieHeader.replace(accessTokenCookieRegex, ''));
};

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		proxy: {
			'^/trpc/*': {
				target: config.serverAddress,
				rewrite: (path) => path.replace('/trpc', ''),
				configure(proxy) {
					proxy.on('proxyReq', apiProxyHandler);
				}
			},
			'^/trpcws/*': {
				target: config.serverAddress.replace('http', 'ws'),
				rewrite: (path) => path.replace('/trpcws', ''),
				ws: true,
				configure(proxy) {
					proxy.on('proxyReqWs', apiProxyHandler);
				}
			}
		}
	}
});
