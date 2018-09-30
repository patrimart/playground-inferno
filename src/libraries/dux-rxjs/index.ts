import { Action, Reducer, MetaReducer, Selector, Effect } from './models';

import { createActions } from './actions';
import { createReducers } from './reducers';
import { createMetaReducers, combineWithReducers } from './metareducers';
import { createStore } from './store';
import { createSelector } from './selectors';
import { createEffects, mergeEffects } from './effects';

export * from './models';

/**
 * Redux without the re
 *
 * Redux pattern with rxjs - batteries included
 *
 * TODO
 * - Figure out Epics/Effects : DONE!
 * - Figure out Teardown : DONE???
 * - Create "Provider" pattern
 */

/**
 * Wrap
 */

export const storeFactory = <S>(initialStore: S) => {
  // Create Source Streams : Actions, Reducers, MetaReducers, Effects
  const actions$ = createActions();
  const { reducerSubject$, reducers$ } = createReducers<S>();
  const { metaReducerSubject$, metaReducers$ } = createMetaReducers<S>();
  const { effectsSubject$, effects$ } = createEffects<S>();

  // Compose MetaReducers and Reducers
  const reducer$ = combineWithReducers(metaReducers$, reducers$);

  // Create state$ and store$ From initialStore, actions, and combined reducers
  const { state$, store$ } = createStore(initialStore, actions$, reducer$);

  // Create Effects Loop
  const effectsSubscription = mergeEffects(store$, effects$).subscribe(
    actions$
  );

  // Create select and dispatch methods
  const select = <O>(m: Selector<S, O>) => createSelector<S, O>(state$)(m);
  const dispatch = (...as: Action[]) => {
    as.map(a => actions$.next(a));
    return undefined;
  };

  const destroy = () => {
    effectsSubscription.unsubscribe();
  };

  const store = {
    // Create add reducers, and add metareducers, and add effects methods
    addReducers: (...rs: Reducer<S>[]) => {
      rs.map(r => reducerSubject$.next(r));
      return store;
    },
    addMetaReducers: (...ms: MetaReducer<S>[]) => {
      ms.map(m => metaReducerSubject$.next(m));
      return store;
    },
    addEffects: (...es: Effect<S>[]) => {
      es.map(e => effectsSubject$.next(e));
      return store;
    },
    select,
    dispatch,
    destroy,
  };

  // Kick Out Store Instance
  return {
    store,
    select,
    dispatch,
  };
};
