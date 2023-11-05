import { LitElement, html } from 'lit';
import { templateContent } from 'lit/directives/template-content.js';
import { customElement, property, state } from 'lit/decorators.js';
import { emit } from './event';

/**
 * @element cipublic-box
 *
 * Usage:
 *
 * A generic, customizable component that can accept different markup
 * and styles
 *
 * <cipublic-box
 *    ?listenForConnectedCallback=${true}
 *    @connected-callback=${(event: { target: HTMLElement }) => {
 *      addStyleSheetToElements([event.target], boxStyles);
 *      addTemplateMarkupToElements([event.target], boxTemplate());
 *    })
 * >
 * </cipublic-box>
 *
 */
@customElement('w-box')
export class Box extends LitElement {
  @property({ reflect: true })
  listenForConnectedCallback = false;

  connectedCallback() {
    super.connectedCallback();

    emit(this, 'connectedCallback');
  }

  @state()
  private _template!: HTMLTemplateElement | null;

  protected render() {
    return !this._template ? html`<slot></slot>` : templateContent(this._template);
  }
}
