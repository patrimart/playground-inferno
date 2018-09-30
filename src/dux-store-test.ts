import { createStore } from './libraries/dux-mostjs';
import { runEffects, tap } from '@most/core';

interface State {
  string: string;
  number: number;
}

const { state, scheduler, addMetaReducer, addReducer, dispatch } = createStore<
  State
>({ string: 'Init', number: 0 });

runEffects(tap(x => console.log('State!', x), state), scheduler);

addReducer<State>(
  'reducer1',
  (s, a) => (a.type === 'string' ? { ...s, string: a.payload || 'default' } : s)
);
addReducer<State>(
  'reducer2',
  (s, a) => (a.type === 'number' ? { ...s, number: a.payload || 0 } : s)
);
addReducer<State>(
  'add',
  (s, a) => (a.type === 'add' ? { ...s, number: (s.number || 0) + 1 } : s)
);
addReducer<State>(
  'subtract',
  (s, a) => (a.type === 'subtract' ? { ...s, number: (s.number || 0) - 1 } : s)
);
addMetaReducer('log', r => (s, a) => {
  // console.log('Logging MetaReducer!', r, s, a);
  return r(s, a);
});

dispatch({ type: 'string' });

setTimeout(() => {
  dispatch({ type: 'string', payload: 'Hiya' });
  dispatch({ type: 'string', payload: 'Hello' });
  dispatch({ type: 'number', payload: 5 });
  dispatch({ type: 'add' });
  dispatch({ type: 'add' });
  dispatch({ type: 'add' });
  dispatch({ type: 'subtract' });
}, 3000);

// import { create } from 'most-subject';
// import { tap, scan, map, combine } from '@most/core';
// import { sink, scheduler } from './libraries/dux-mostjs/utils';
// import { runEffects } from '@most/core';

// const [mySink, myStream] = create<string>();
// const [myOtherSink, myOtherStream] = create<string>();

// const dispatch = sink(mySink);
// const dispatchOther = sink(myOtherSink);

// const scanned = scan((a, c) => [...a, c], [] as string[], myStream);
// const flattened = map(a => a.join('\n'), scanned);

// const combined = combine((o, f) => `${o} : ${f}`, myOtherStream, flattened);

// runEffects(tap(x => console.log('Event!', x), combined), scheduler);

// let i = 0;

// setInterval(() => {
//   dispatch(`Hey there ${i}`);
//   i++;
// }, 2000);

// setInterval(() => {
//   dispatchOther(`Oh Hi ${i}`);
// }, 3000);
