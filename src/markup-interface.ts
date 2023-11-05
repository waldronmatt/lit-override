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

  if (!template.strings[0]) {
    console.error(
      `The property 'strings[0]' on 'template' does not exist. Please check if this is still supported by Lit.`
    );
    return;
  }

  elements.forEach((element: Element) => {
    if (element) {
      const name = element.nodeName.toLowerCase();
      // check if the element is a web component
      if (name && name.includes("-")) {
        // https://developers.google.com/web/fundamentals/web-components/customelements#progressively_enhanced_html
        customElements
          .whenDefined(name)
          .then(() => {
            if (!("_template" in element)) {
              console.error(
                `Property '_template' does not existing on element ${name}. Please add it.`
              );
              return;
            } else {
              const templateElement = document.createElement("template");
              // template.strings[0] is fragile because this relies on Lit's interal template API
              templateElement.innerHTML = template.strings[0];
              // assign the template override to the w-box `_template` prop
              (element as any)._template = templateElement;
            }
          })
          .catch((error) => {
            console.error(
              `There was an error with component registration: ${error}`
            );
            return;
          });
      }
    }
  });
};
