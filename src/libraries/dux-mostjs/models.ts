/**
 * Action Types
 */
export interface Action {
  type: string;
  [key: string]: any;
}

/**
 * Reducer Types
 */
export type Reducer<S = any> = (s: S, a: Action) => S;
export interface ReducerAdd<S = any> {
  key: string;
  change: 'add';
  reducer: Reducer<S>;
}
export interface ReducerRemove {
  key: string;
  change: 'remove';
}
export type ReducerModify<S = any> = ReducerAdd<S> | ReducerRemove;

/**
 * MetaReducer Types
 */
export type MetaReducer<S = any> = (r: Reducer<S>) => Reducer<S>;
export interface MetaReducerAdd<S = any> {
  key: string;
  change: 'add';
  metaReducer: MetaReducer<S>;
}
export interface MetaReducerRemove {
  key: string;
  change: 'remove';
}
export type MetaReducerModify<S = any> = MetaReducerAdd<S> | MetaReducerRemove;

/**
 * Store Types
 */
export type State<S extends Record<string, any>> = S;

export interface StoreReduction<S = any> {
  prev: State<S>;
  next: State<S>;
  action: Action;
}

/**
 * Selector Types
 */
export type Selector<S, O> = (s: S) => O;
