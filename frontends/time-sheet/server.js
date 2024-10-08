import { handler } from './dist/handler';
import { startServer } from 'frontend.shared/server.js';

startServer(handler);
