import { LitElement, html } from "lit";
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
  @property({ reflect: true, type: Boolean })
  emitConnectedCallback = false;

  @state()
  private template: HTMLTemplateElement | null = this.querySelector("template");

  connectedCallback() {
    super.connectedCallback();

    if (this.emitConnectedCallback) {
      emit(this, "connected-callback");
    }
  }

  protected render() {
    return !this.template
      ? html`<slot></slot>`
      : templateContent(this.template);
  }
}
