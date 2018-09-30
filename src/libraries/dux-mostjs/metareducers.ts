import { create } from 'most-subject';
import { scan, map } from '@most/core';

import {
  MetaReducerModify,
  MetaReducerAdd,
  Reducer,
  MetaReducer,
} from './models';
import { sink } from './utils';

export const metaReducerFactory = () => {
  const [metaReducersModifySink, metaReducersModifyStream] = create();
  const metaReducersStream = scan(
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
    [] as MetaReducerAdd[],
    metaReducersModifyStream
  );
  const metaReducerSink = sink<MetaReducerModify>(metaReducersModifySink);

  const metaReducerStream = map(
    s =>
      s.reduce(
        (acc, mr) => (r: Reducer) => mr.metaReducer(acc(r)),
        (r: Reducer): Reducer => r
      ),
    metaReducersStream
  );
  const addMetaReducer = <S>(key: string, metaReducer: MetaReducer<S>) =>
    metaReducerSink({ change: 'add', key, metaReducer });
  const removeMetaReducer = (key: string) =>
    metaReducerSink({ change: 'remove', key });

  return {
    metaReducerStream,
    addMetaReducer,
    removeMetaReducer,
  };
};
