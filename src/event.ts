// https://github.com/shoelace-style/shoelace/blob/next/src/internal/event.ts

// Emits a custom event with more convenient defaults.
export function emit(el: HTMLElement, name: string, options?: CustomEventInit) {
  const event = new CustomEvent(
    name,
    Object.assign(
      {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {},
      },
      options
    )
  );
  el.dispatchEvent(event);

  return event;
}

// Waits for a specific event to be emitted from an element. Ignores events that bubble up from child elements.
export function waitForEvent(
  el: HTMLElement,
  eventName: string,
  listenOnce = false
) {
  return new Promise<void>((resolve) => {
    function done(event: Event) {
      if (event.target === el) {
        el.removeEventListener(eventName, done);
        resolve((event as CustomEvent).detail);
      }
    }

    el.addEventListener(eventName, done, { once: listenOnce });
  });
}
