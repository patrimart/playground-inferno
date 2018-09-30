import { createElement } from 'inferno-create-element';

type C<P = unknown> = (p: P) => JSX.Element;

const Select = (WrappedComponent: C) => <WrappedComponent />;
