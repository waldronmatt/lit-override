import { html, css, TemplateResult, CSSResult, LitElement } from 'lit';
import { customElement, queryAll } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { until } from 'lit/directives/until.js';
import { addStyleSheetToElements } from './css-stylesheet-interface.js';
import { addTemplateMarkupToElements } from './template-interface.js';
import './box.js';

@customElement('w-promo')
export class Promo extends LitElement {
  static styles: CSSResult = css`
    :host {
      display: block;
    }
  `;

  @queryAll('my-button')
  _myButtons: Array<HTMLElement>;

  private list = fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => response.json())

  private styleOverride: CSSResult = css`
    :host {
      display: block;
      border: 2px solid #000000;
      margin-top: 1rem;
    }

    ::slotted([slot='heading']) {
      color: #0000FF;
    }

    ::slotted([slot='content']) {
      color: #FF0000;
    }
  `;

  private renderOverride(): TemplateResult {
    return html`
      <slot name="heading">This is a heading!</slot>
      <slot name="content">Here is a parapgraph below the heading.</slot>
    `;
  }

  render(): TemplateResult {
    return html`
      <section>
        <h2>Default box component</h2>
        <w-box>
          <ul>
            <li>Renders a generic slot</li>
            <li>No styles are included</li>
            <li>Emitting connectedCallback is disabled</li>
          </ul>
        </w-box>
      </section>
      <section>
        <h2>A box component with customized markup and styles!</h2>
        <w-box
          ?listenForConnectedCallback=${true}
          @connectedCallback=${(event: { target: LitElement }) => {
            addStyleSheetToElements([event.target], this.styleOverride);
            addTemplateMarkupToElements([event.target], this.renderOverride());
          }}
        >
          <h3 slot="heading">This is a heading!</h3>
          <p slot="content">Here is a parapgraph below the heading.</p>
        </w-box>
      </section>
      <section>
      <h2>We can generate a customized box component from an endpoint!</h2>
      ${until(this.list.then((data) => {
        return html`${repeat(data, (item: any) => item.id, (item) => html`
          <w-box
            ?listenForConnectedCallback=${true}
            @connectedCallback=${(event: { target: LitElement }) => {
              addStyleSheetToElements([event.target], this.styleOverride);
              addTemplateMarkupToElements([event.target], this.renderOverride());
            }}
          >
            <h3 slot="heading">${item.name}</h3>
            <p slot="content">${item.company.catchPhrase}</p>
          </w-box>
        `)}`
      }), html`<p>Loading...</p>`)}
      </section>
    `;
  }
}
