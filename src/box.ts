import { LitElement, html, css, CSSResult } from "lit";
import { templateContent } from "lit/directives/template-content.js";
import { customElement, property, state } from "lit/decorators.js";
import { emit } from "./event";

/**
 * @element cipublic-box
 *
 * Usage:
 *
 * A generic, customizable component that can accept different markup
 * and styles
 *
 * import { addStyleSheetToElements } from "./stylesheet-interface.js";
 * import { addMarkupToElements } from "./markup-interface.js";
 * import "./box.js";
 *
 * private applyStyleOverride: CSSResult = css`
 *  // your overriding styles go here
 * `;
 *
 * private renderMarkupOverride(): TemplateResult {
 *  // your overriding markup goes here
 * };
 *
 * <w-box
 *    ?emitConnectedCallback=${true}
 *    @connected-callback=${(event: { target: HTMLElement }) => {
 *      addStyleSheetToElements([event.target], applyStyleOverride);
 *      addMarkupToElements([event.target], renderMarkupOverride());
 *    })
 * >
 *  <h3 slot="heading">This is a heading!</h3>
 *  <p slot="content">Here is a parapgraph below the heading.</p>
 * </w-box>
 *
 */
@customElement("w-box")
export class Box extends LitElement {
  static styles: CSSResult = css`
    :host:not(:defined) {
      /* Pre-style, give layout, etc. */
      /* https://web.dev/articles/custom-elements-v1#pre-styling_unregistered_elements */
      display: inline-block;
      height: 100vh;
      opacity: 0;
      // transition duration is high to visualize
      transition: opacity 0.3s ease-in-out;
    }
  `;

  @property({ reflect: true, type: Boolean })
  emitConnectedCallback = false;

  connectedCallback() {
    super.connectedCallback();

    if (this.emitConnectedCallback) {
      emit(this, "connected-callback");
    }
  }

  @state()
  private _template!: HTMLTemplateElement | null;

  protected render() {
    return !this._template
      ? html`<slot></slot>`
      : templateContent(this._template);
  }
}
