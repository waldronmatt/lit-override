import { html, css, TemplateResult, CSSResult, LitElement } from "lit";
import { customElement, queryAll } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { until } from "lit/directives/until.js";
import { addStyleSheetToElements } from "./stylesheet-interface.js";
import { addMarkupToElements } from "./markup-interface.js";
import "./box.js";

@customElement("w-promo")
export class Promo extends LitElement {
  static styles: CSSResult = css`
    :host {
      display: block;
    }
  `;

  @queryAll("my-button")
  _myButtons: Array<HTMLElement>;

  private list = fetch("https://jsonplaceholder.typicode.com/users").then(
    (response) => response.json()
  );

  private applyStyleOverride: CSSResult = css`
    :host {
      display: block;
      border: 2px solid #000000;
      margin-top: 1rem;
    }

    ::slotted([slot="heading"]) {
      color: #0000ff;
    }

    ::slotted([slot="content"]) {
      color: #ff0000;
    }
  `;

  private renderMarkupOverride(): TemplateResult {
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
          ?emitConnectedCallback=${true}
          @connected-callback=${(event: { target: LitElement }) => {
            addStyleSheetToElements([event.target], this.applyStyleOverride);
            addMarkupToElements([event.target], this.renderMarkupOverride());
          }}
        >
          <h3 slot="heading">This is a heading!</h3>
          <p slot="content">Here is a parapgraph below the heading.</p>
        </w-box>
      </section>
      <section>
        <h2>We can generate a customized box component from an endpoint!</h2>
        ${until(
          this.list.then((data) => {
            return html`${repeat(
              data,
              (item: any) => item.id,
              (item) => html`
                <w-box
                  ?emitConnectedCallback=${true}
                  @connected-callback=${(event: { target: LitElement }) => {
                    addStyleSheetToElements(
                      [event.target],
                      this.applyStyleOverride
                    );
                    addMarkupToElements(
                      [event.target],
                      this.renderMarkupOverride()
                    );
                  }}
                >
                  <h3 slot="heading">${item.name}</h3>
                  <p slot="content">${item.company.catchPhrase}</p>
                </w-box>
              `
            )}`;
          }),
          html`<p>Loading...</p>`
        )}
      </section>
    `;
  }
}
