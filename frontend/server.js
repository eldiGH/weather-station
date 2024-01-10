import { handler } from './dist//handler.js';
import httpProxy from 'http-proxy';
import config from './src/config.json' with { type: 'json' };
import { createServer } from 'http';

const port = process.env.PORT ?? 5173;

const proxy = httpProxy.createProxyServer({ target: config.serverAddress, ws: true });

const server = createServer((req, res) => {
	if (req.url.startsWith('/trpc/')) {
		req.url = req.url.replace(/^\/trpc\//, '');
		proxy.web(req, res);
		return;
	}

	handler(req, res);
});

server.on('upgrade', (req, socket, head) => {
	req.url = req.url.replace('/trpcws', '');
	proxy.ws(req, socket, head);
});

server.on('listening', () => {
	console.log(`Listening on port ${port}`);
});

server.listen(port);
