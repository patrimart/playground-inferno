import { createElement } from 'inferno-create-element';

import { render } from 'inferno';

import { MyComponent } from './components/MyComponent';

class MyElement extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('div');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const age = Number(this.getAttribute('age'));
    const sex = this.getAttribute('sex') || '';
    const location = this.getAttribute('location') || '';
    render(<MyComponent age={age} sex={sex} location={location} />, mountPoint);
  }
}

customElements.define('my-element', MyElement);
