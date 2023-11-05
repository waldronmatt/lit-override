# Lit Override

A demo site that utilizes a generic lit web component and utilities to customize/override styles and markup.

Check out this [live demo](https://studio.webcomponents.dev/view/XlfSrBJgu8hrptGm02hE)!

## Usage

`app.ts`

```ts
import { html, css, TemplateResult, CSSResult, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { addStyleSheetToElements } from "./stylesheet-interface.js";
import { addMarkupToElements } from "./markup-interface.js";
import "./w-box.js";

@customElement("app")
export class App extends LitElement {
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
      <slot name="heading"></slot>
      <slot name="content"></slot>
    `;
  }

  render(): TemplateResult {
    return html`
      <w-box
        ?listenForConnectedCallback=${true}
        @connected-callback=${(event: { target: HTMLElement }) => {
          addStyleSheetToElements([event.target], this.applyStyleOverride);
          addMarkupToElements([event.target], this.renderMarkupOverride());
        }}
      >
        <h3 slot="heading">This is a heading!</h3>
        <p slot="content">Here is a paragraph below the heading.</p>
      </w-box>
    `;
  }
}
```

## Features

Maintain web component encapsulation while providing added flexibility to customize/override styles and markup without needing to create or modify components.

- Override styles: Supports css child selectors and flexible overriding (improvement over `:part` and css variables)
- Override markup: Supports generic and named slots
- No race conditions: Apply overrides to child components/apps reliably
- Lazy-loading support: Supports dynamically applying overrides to lazy-loaded components
- Leverage one base component to create infinite combinations: No need to modify existing components or create new ones

## Background

When building out a design library, I came across situations where I needed a parent component/app to override child component styles and markup. Use cases included rendering different combinations of `p` tags, `div` tags, images, and other basic elements.

Ideally, a design system will atomize everything perfectly to create composable components, but oftentimes, requirements can deviate from an optimal solution. Updating existing components to support new variants would be preferred, but what if we have situations where component variants differ in markup and styles significantly?

One option would be to break this out into a separate component, but this can create unwieldy code if styles and markup differ across many components/apps. Creating new components grouped together with one centralized component creates additional overhead and boilerplate. Another option would be to use regular html and css, but I still wanted to leverage the encapsulation benefits of web components.

## How it Works

In order for overriding to work, the parent component needs a reliable way to know when `connectedCallback` has fired for the child components. This has been a pressing topic in the web component community as seen in [this thread](https://github.com/WICG/webcomponents/issues/619). Luckily there is an easy workaround.

In the child component's `connectedCallback`, emit an event so the parent component can listen and act on it. This helps prevent race conditions where the parent's `connectedCallback` fires before children `connectedCallback`.

To avoid too much noise from `connectedCallback` events being emitted, this feature is disabled by default which can be useful in situations where you have default styling and don't intend to override. You must pass in `emitConnectedCallback` prop as `true` to enable overriding.

For situations where components are lazy-loaded, the solution above won't be enough. In `stylesheet-interface.ts` and `markup-interface.ts`, we use `whenDefined` to inject custom styles and markup only when elements become registered.

## Limitations

- This project assumes you are overriding styles and markup on initial load only via `connectedCallback`. Additional work would need to be done to support overriding if state changes (for example, if you decide to inject styles and markup at a later point in the component's/app's lifecycle or after an action).

- As described in more detail below, this project relies on Lit for overriding. For a native web component implementation, check out [this article](https://css-tricks.com/encapsulating-style-and-structure-with-shadow-dom/#aa-the-best-of-both-worlds) and associated [codepen](https://codepen.io/calebdwilliams/pen/rROadR).

`markup-interface.ts`

- Props fed into your custom markup will not work. Only static markdown is supported.
- This utility is fragile because it relies on Lit's internal `template` to set the markup overrides.
- Custom elements such as `w-box` must be configured to accept templates for this utility to work.

`stylesheet-interface.ts`

- `adoptedStylesheets` will append your custom styles after the component's default styling. This is a spec built into the API; see [this thread](https://github.com/WICG/construct-stylesheets/issues/45) for more info. In this repo, this isn't a problem because `w-box` comes with no stylings by default. If you do include this utility in a component with default styles, you may need to use `!important` to override which isn't ideal.

- This utility is fragile because the fallback behavior relies on Lit's internal `style` to set the style overrides.

## Caution

Before using these utilities for your own use, please note that they are experimental. For production sites, please use at your own risk.

Please also note that you should first try to align with teams on a design system that promotes component composability to avoid overriding in the first place.
