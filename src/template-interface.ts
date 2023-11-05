import { TemplateResult } from 'lit';

/**
 * Applies the given template to the elements' `shadowRoot`.
 *
 * **Note**: Custom elements provided must be configured to accept templates.
 *
 * @param elements iterable of elements to apply styles to
 * @param template TemplateResult
 */
export const addTemplateMarkupToElements = (elements: NodeListOf<Element> | Array<Element>, template: TemplateResult): void => {
  if (!elements.length) {
    return;
  }

  const templateElement = document.createElement('template');
  templateElement.innerHTML = template.strings[0];

  elements.forEach((element) => {
    const name = element.nodeName.toLowerCase();
    // https://developers.google.com/web/fundamentals/web-components/customelements#progressively_enhanced_html
    customElements.whenDefined(name).then(() => {
      (element as any)._template = templateElement;
    });
  });
};
