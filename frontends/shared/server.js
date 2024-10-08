import httpProxy from 'http-proxy';
import config from '../weather-station/src/config.json' with { type: 'json' };
import { createServer } from 'http';

/**
 * @param {(req: IncomingMessage, res: ServerResponse<IncomingMessage>) => void} handler
 */
export const startServer = (handler) => {
	const proxy = httpProxy.createProxyServer({ target: config.serverAddress, ws: true });

	const port = process.env.PORT ?? 5173;

	const server = createServer((req, res) => {
		if (req.url?.startsWith('/trpc/')) {
			req.url = req.url.replace(/^\/trpc\//, '');
			proxy.web(req, res);
			return;
		}

		handler(req, res);
	});

	server.on('upgrade', (req, socket, head) => {
		req.url = req.url?.replace('/trpcws', '');
		proxy.ws(req, socket, head);
	});

	server.on('listening', () => {
		console.log(`Listening on port ${port}`);
	});

	server.listen(port);
};
