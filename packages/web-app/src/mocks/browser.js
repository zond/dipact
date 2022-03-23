import { setupWorker } from 'msw';

import { handlersList } from './handlers';

export const worker = setupWorker(...handlersList);