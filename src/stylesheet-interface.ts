import { CSSResult } from "lit";
import { supportsAdoptingStyleSheets } from "@lit/reactive-element";

/**
 * Applies the given style using `adoptedStyleSheets`.
 *
 * **Note**: Appends the style to the `shadowroot` of elements for browser fallback.
 *
 * @param elements iterable of elements to apply styles to
 * @param style CSSResult
 */
export const addStyleSheetToElements = (
  elements: NodeListOf<Element> | Array<Element>,
  style: CSSResult
): void => {
  if (!elements || !elements.length || !style) {
    return;
  }

  if (!style.cssText) {
    console.error(
      `The property 'cssText' on 'style' does not exist. Please check if this is still supported by Lit.`
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
            if (supportsAdoptingStyleSheets) {
              (element as any).renderRoot.adoptedStyleSheets = [
                ...(element as any).renderRoot.adoptedStyleSheets,
                style.styleSheet,
              ];
            } else {
              const styleEl = document.createElement("style");
              // style.cssText is fragile because this relies on Lit's interal API
              styleEl.textContent = style.cssText;
              (element as any).renderRoot.appendChild(styleEl);
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
