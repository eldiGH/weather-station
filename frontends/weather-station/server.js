import { handler } from './build/handler.js';
import { startServer } from '@shared/ui/server.js';

startServer(handler);
