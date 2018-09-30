import { createElement } from 'inferno-create-element';
import { render } from 'inferno';
import { Option, none, some } from 'fp-ts/lib/Option';

import { storeFactory } from './libraries/dux-rxjs';

const {
  store: { addReducers, addMetaReducers },
} = storeFactory({ text: 'Hi', count: 0 });

addReducers((s, a) => (a.type === 'add' ? { ...s, count: s.count + 1 } : s));
addMetaReducers(r => r);

const TestComp = (
  { text, count }: { text: Option<string>; count: Option<number> } = {
    text: none,
    count: none,
  }
) => (
  <div>
    <h1>{text.getOrElse('Hello')}</h1>
    <span>Count: {count.getOrElse(2)}</span>
  </div>
);

const TestContainer = () => {
  const text = some('Hi');
  const count = some(0);
  return <TestComp text={text} count={count} />;
};

const MyWebsite = () => <TestContainer />;

const container = document.getElementById('app');

render(<MyWebsite />, container);
