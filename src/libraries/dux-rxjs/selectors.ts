import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, filter } from 'rxjs/operators';

import { Store, Selector } from './models';

/**
 * Utility function that filters out undefineds and cases to the correct type.
 */
const filterNil = <S>() =>
  filter(
    (val: S | undefined | null): val is S => val !== undefined && val !== null
  );

/**
 * Creates a new observable from store$ that encapsulates into its own stream.
 * Errors in bad selectors are caught so they don't break parent observable.
 */
export const createSelector = <S, O>(store$: Observable<Store<S>>) => (
  s: Selector<S, O>
): Observable<O> =>
  store$.pipe(
    switchMap(x =>
      of(x).pipe(
        map(s),
        catchError(e => {
          console.error('Error thrown by selector', s, e);
          return of(undefined);
        }),
        filterNil()
      )
    )
  );
