import {
  scan,
  withLatestFrom,
  distinctUntilChanged,
  map,
  share,
} from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { Reducer, Store, Action, StoreReduction } from './models';

/**
 * Creates the store$ and state$ observables from init, actions$, and reducer$
 *
 * store$ - an observable that emits StoreReduction<S> after every action
 * state$ - an observable that emits Store<S> every time the store changes
 */
export const createStore = <S>(
  init: Store<S>,
  as: Observable<Action>,
  rs: Observable<Reducer<S>>
) => {
  const initialStore$ = new BehaviorSubject<Store<S>>(init);
  const store$ = as.pipe(
    withLatestFrom(rs, initialStore$),
    scan<[Action, Reducer<S>, Store<S>], StoreReduction<S>>(
      ({ next }, [action, reducer, init]) => ({
        prev: next,
        action,
        next: reducer(next || init, action),
      }),
      { prev: init, next: init, action: { type: '__INIT_STORE__' } }
    ),
    share()
  );
  const state$ = store$.pipe(
    map(({ next }) => next),
    distinctUntilChanged(),
    share()
  );
  return { state$, store$ };
};
