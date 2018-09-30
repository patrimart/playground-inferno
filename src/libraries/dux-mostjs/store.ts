import { combine, snapshot, scan, skipRepeats, map, run } from '@most/core';
import { hold } from '@most/hold';

import { actionFactory } from './actions';
import { metaReducerFactory } from './metareducers';
import { reducerFactory } from './reducers';
import { selectorFactory } from './selectors';
import { StoreReduction, State } from './models';
import { scheduler } from './utils';

export const createStore = <S extends {}>(initialState: State<S>) => {
  const {
    metaReducerStream,
    addMetaReducer,
    removeMetaReducer,
  } = metaReducerFactory();
  const { reducerStream, addReducer, removeReducer } = reducerFactory();
  const { actionSink, actionStream, dispatch } = actionFactory();

  // Combine MetaReducers and Reducers
  const reducer = combine((mr, r) => mr(r), metaReducerStream, reducerStream);

  // Snapshot Actions with Reducer
  const actionReducer = snapshot(
    (reducer, action) => ({ reducer, action }),
    reducer,
    actionStream
  );

  // Store and State
  const store = scan(
    ({ next }: StoreReduction<State<S>>, { action, reducer }) => ({
      prev: next,
      action,
      next: reducer(next, action),
    }),
    {
      next: initialState,
      prev: initialState,
      action: { type: '__INIT_STORE__' },
    },
    actionReducer
  );
  const currentState = skipRepeats(map(({ next }) => next, store));
  const state = hold(currentState);

  // Selectors
  const select = selectorFactory(state);

  // Initialize
  run(actionSink, scheduler);
  addMetaReducer('IDENTITY_META_REDUCER', r => r);
  addReducer('IDENTITY_REDUCER', s => s);

  return {
    addMetaReducer,
    removeMetaReducer,
    addReducer,
    removeReducer,
    dispatch,
    select,
    state,
    scheduler,
  };
};
