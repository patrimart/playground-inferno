import { map } from '@most/core';
import { Stream } from '@most/types';

import { State, Selector } from './models';

/**
 * Creates a new observable from state that encapsulates into its own stream.
 * Errors in bad selectors are caught so they don't break parent observable.
 */
export const selectorFactory = <S, O>(state: Stream<State<S>>) => (
  s: Selector<S, O>
): Stream<O> => map(s, state);
