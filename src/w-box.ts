import { LitElement, html, css, CSSResult } from "lit";
import { templateContent } from "lit/directives/template-content.js";
import { customElement, property, state } from "lit/decorators.js";
import { emit } from "./event";

/**
 * @element cipublic-box
 *
 * A generic component that can accept different styles and markup
 */
@customElement("w-box")
export class Box extends LitElement {
  static styles: CSSResult = css`
    :host:not(:defined) {
      /* https://web.dev/articles/custom-elements-v1#pre-styling_unregistered_elements */
      display: inline-block;
      height: 100vh;
      opacity: 0;
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
