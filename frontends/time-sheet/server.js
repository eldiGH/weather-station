import { handler } from './dist/handler.js';
import { startServer } from 'frontend.shared/server.js';

startServer(handler);
