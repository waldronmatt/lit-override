import { CSSResult } from "lit";
import { supportsAdoptingStyleSheets } from "@lit/reactive-element";

/**
 * Applies the given styles to a `shadowRoot` when `adoptedStyleSheets` is available in the browser.
 *
 * Appends the given styles to the `shadowRoot` of the `childElements` for when
 * `adoptedStyleSheets` is not available in the browser.
 *
 * @param elements iterable of elements to apply styles to
 * @param style CSSResult
 *
 * [Reference](https://github.com/lit/lit/blob/e0c6e2c928ea5e50fae2b75f8c56ef4f2f47ad84/packages/reactive-element/src/css-tag.ts#L106-L130)
 */
export const addStyleSheetToElements = (
  elements: NodeListOf<Element> | Array<Element>,
  style: CSSResult
): void => {
  if (!elements || !elements.length) {
    return;
  }

  elements.forEach((element) => {
    if (element) {
      const name = element.nodeName.toLowerCase();
      if (name && name.includes("-")) {
        // https://developers.google.com/web/fundamentals/web-components/customelements#progressively_enhanced_html
        customElements
          .whenDefined(name)
          .then(() => {
            if (supportsAdoptingStyleSheets) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (element as any).renderRoot.adoptedStyleSheets = [
                ...(element as any).renderRoot.adoptedStyleSheets,
                style.styleSheet,
              ];
            } else {
              // this fallback behavior aligns with the web component API spec
              const styleEl = document.createElement("style");
              styleEl.textContent = style.cssText;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (element as any).renderRoot.appendChild(styleEl);
            }
          })
          .catch((error) => console.error(error));
      }
    }
  });
};
