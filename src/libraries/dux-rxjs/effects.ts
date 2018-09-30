import { BehaviorSubject, EMPTY, Observable, from } from 'rxjs';
import {
  scan,
  withLatestFrom,
  mergeMap,
  mergeAll,
  map,
  share,
} from 'rxjs/operators';

import { Effect, StoreReduction } from './models';

/**
 * Creates a subject that can be used to gather effects into an array
 */
export const createEffects = <S>() => {
  const effectsSubject$ = new BehaviorSubject<Effect<S>>(() => EMPTY);
  const effects$ = effectsSubject$.pipe(
    scan((acc: Effect<S>[], val: Effect<S>) => [...acc, val], [])
  );

  return { effectsSubject$, effects$ };
};

/**
 * Attaches effects to the store ({ prev: Store<S>, action: Action, next: Store<S> })
 */
export const mergeEffects = <S>(
  store$: Observable<StoreReduction<S>>,
  effects$: Observable<Effect<S>[]>
) =>
  store$.pipe(
    withLatestFrom(effects$),
    map(([store, effects]) => effects.map(effect => effect(store))), // Kick off each effect
    mergeMap(effectObs => from(effectObs)), // flatten effect output array
    mergeAll(), // flatten resultant observables
    share()
  );
