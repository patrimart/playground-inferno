import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { scan, map } from 'rxjs/operators';

import { MetaReducer, Reducer } from './models';

/**
 * Creates a metareducer subject that composes new metareducers as they come in
 *
 * TODO
 * - Expand interface for removal of metareducers? - Don't think it's necessary
 * - - MetaReducer[] => Metareducer Step ?
 * - Introduce some error encapsulation so bad metareducers don't break all the
 *   things... - Meh..
 */
export const createMetaReducers = <S>() => {
  const metaReducerSubject$ = new BehaviorSubject<MetaReducer<S>>(r => r);
  const metaReducers$ = metaReducerSubject$.pipe(
    scan(
      (acc: MetaReducer<S>, val: MetaReducer<S>): MetaReducer<S> => r =>
        val(acc(r))
    )
  );

  return { metaReducerSubject$, metaReducers$ };
};

/**
 * Wrapes the reducer observable in the metareducer observable so
 * that the metareducers run first.
 */
export const combineWithReducers = (
  ms: Observable<MetaReducer>,
  rs: Observable<Reducer>
) => combineLatest(rs, ms).pipe(map(([r, m]) => m(r)));
