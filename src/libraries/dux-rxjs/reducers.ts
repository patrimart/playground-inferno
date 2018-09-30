import { BehaviorSubject } from 'rxjs';
import { scan } from 'rxjs/operators';

import { Reducer } from './models';

/**
 * Creates a reducer subject that composes new reducers as they come in
 *
 * TODO
 * - Expand interface for removal of reducers?
 * - - reducer[] => reducer Step ?
 * - Introduce some error encapsulation so bad reducers don't break all
 */
export const createReducers = <S>() => {
  const reducerSubject$ = new BehaviorSubject<Reducer<S>>((s, _) => s);
  const reducers$ = reducerSubject$.pipe(
    scan(
      (acc: Reducer<S>, val: Reducer<S>): Reducer<S> => (s, a) =>
        val(acc(s, a), a)
    )
  );

  return { reducerSubject$, reducers$ };
};
