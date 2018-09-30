import { Observable } from 'rxjs';

export interface Action<T extends string = string, P = any> {
  type: T;
  payload?: P;
}

export type Store<S extends {}> = S;

export type StoreTransform<I, O> = (s: Store<I>, ...a: any[]) => Store<O>;
export type ST<I, O> = StoreTransform<I, O>;

export interface StoreReduction<S> {
  prev: Store<S>;
  action: Action;
  next: Store<S>;
}

export type Reducer<S = any, A = Action> = (s: Store<S>, action: A) => Store<S>;

export type MetaReducer<S = any, A = Action, R = Reducer<S, A>> = (r: R) => R;

export type Effect<S = unknown> = (
  store: StoreReduction<S>
) => Observable<Action>;

export type Selector<S = unknown, O = unknown> = (s: S) => O;
