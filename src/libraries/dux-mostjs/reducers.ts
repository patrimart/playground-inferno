import { create } from 'most-subject';
import { scan, map } from '@most/core';

import { ReducerModify, ReducerAdd, Action, Reducer, State } from './models';
import { sink } from './utils';

export const reducerFactory = <S>() => {
  const [reducersModifySink, reducersModifyStream] = create<ReducerModify>();
  const reducersStream = scan(
    (rs, nr) => {
      switch (nr.change) {
        case 'add':
          return [...rs, nr];
        case 'remove':
          return rs.filter(r => r.key === nr.key);
        default:
          return rs;
      }
    },
    [] as ReducerAdd[],
    reducersModifyStream
  );
  const reducerSink = sink<ReducerModify>(reducersModifySink);

  const reducerStream = map(
    s =>
      s.reduce(
        (acc, r) => (s: State<S>, a: Action) => r.reducer(acc(s, a), a),
        (s: State<S>, _: Action): State<S> => s
      ),
    reducersStream
  );
  const addReducer = <S>(key: string, reducer: Reducer<S>) =>
    reducerSink({ change: 'add', key, reducer });
  const removeReducer = (key: string) => reducerSink({ change: 'remove', key });

  return {
    reducerStream,
    addReducer,
    removeReducer,
  };
};
