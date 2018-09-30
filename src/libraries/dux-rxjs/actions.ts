import { Subject } from 'rxjs';

import { Action } from './models';

/**
 * A simple actions Subject. Actions are nexted into this and
 * all other store sections subscribe here to do cool things.
 */
export const createActions = () => new Subject<Action>();
