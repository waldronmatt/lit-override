import { TemplateResult } from "lit";

/**
 * Applies the given template to the elements' `shadowRoot`.
 *
 * **Note**: Custom elements provided must be configured to accept templates.
 *
 * @param elements iterable of elements to apply styles to
 * @param template TemplateResult
 */
export const addMarkupToElements = (
  elements: NodeListOf<Element> | Array<Element>,
  template: TemplateResult
): void => {
  if (!elements.length) {
    return;
  }

  const templateElement = document.createElement("template");
  // template.strings[0] is fragile because this relies on Lit's interal template API
  templateElement.innerHTML = template.strings[0];

  elements.forEach((element) => {
    const name = element.nodeName.toLowerCase();
    // https://developers.google.com/web/fundamentals/web-components/customelements#progressively_enhanced_html
    customElements
      .whenDefined(name)
      .then(() => {
        // assign the template override to the w-box `_template` prop
        (element as any)._template = templateElement;
      })
      .catch((error) => console.error(error));
  });
};
