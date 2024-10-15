import { handler } from './build/handler.js';
import { startServer } from 'frontend.shared/server.js';

startServer(handler);
