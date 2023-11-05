# Lit Override

A demo site that utilizes a generic lit web component and utilities to customize/override markup and styles.

## Usage

`my-app.ts`

```ts
import { addStyleSheetToElements } from "./stylesheet-interface.js";
import { addMarkupToElements } from "./markup-interface.js";
import "./box.js";

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
    <slot name="heading">This is a heading!</slot>
    <slot name="content">Here is a parapgraph below the heading.</slot>
  `;
};

<w-box
    ?listenForConnectedCallback=${true}
    @connected-callback=${(event: { target: HTMLElement }) => {
      addStyleSheetToElements([event.target], applyStyleOverride);
      addMarkupToElements([event.target], renderMarkupOverride());
    })
>
  <h3 slot="heading">This is a heading!</h3>
  <p slot="content">Here is a parapgraph below the heading.</p>
</w-box>
```

## Background

When building out a design library, I came across situations where I needed a parent component/app to override child component styles and markup.

Ideally, a design system will atomize everything perfectly to create composable components, but oftentimes, requirements can deviate from an optimal solution.

Updating existing components would be preferred to add a new variant, but what if we have situations where component variants differ in markup and styles significantly? One option would be to break this out into a separate component, but this can create problems if markup and styles differ significantly depending on the context. Another option would be to use regular html and css, but I still wanted to leverage the encapsulation benefits of web components. I needed to figure out a way to easily customize them.

## How it Works

In order for overriding to work, the parent component needs a reliable way to know when `connectedCallback` has fired for the child components. This has been a pressing topic in the web component community as seen in [this thread](https://github.com/WICG/webcomponents/issues/619). Luckily there is an easy workaround.

In the child component's `connectedCallback`, emit an event so the parent component can listen and act on it. This helps prevent race conditions where the parent's `connectedCallback` fires before children `connectedCallback`.

To avoid too much noise from emitting `connectedCallback` events, this feature is disabled by default which can be useful in situations where you have default styling and don't intend to override. You must pass in `listenForConnectedCallback` prop as true to enable overriding.

For situations where components are lazy-loaded, the solution above won't be enough. In `stylesheet-interface.ts` and `markup-interface.ts`, we use `whenDefined` to inject custom styles and markup only when the promise has been fulfilled (when elements become registered) and return an error stack trace when something goes wrong.

## Features

Maintain web component encapsulation while providing added flexibility without needing to create or modify components.

- Override styles: Supports css child selectors and flexible overriding (improvement over `:part` and css variables)
- Override markup: Supports generic and named slots
- No race conditions: Guaranteed access to child components/lazy-loaded child components

## Limitations

`markup-interface.ts`: Props fed into your custom markup will not work. Only static markdown is supported.

`stylesheet-interface.ts`: `adoptedStylesheets` will append your custom styles after the component's default styling. This is a spec built into the API; see [this thread](https://github.com/WICG/construct-stylesheets/issues/45) for more info. In this repo, this isn't a problem because `w-box` comes with no stylings by default. If you do include this utility in a component with default styles, you may need to use `!important` to override which isn't ideal.

## Caution

Before using these utilities for your own use, please note that they are experimental. For production sites, please use at your own risk.

Please also note that you should first try to align with teams on a design system that promotes atomization of elements for optimal component composability to avoid overriding in the first place.
