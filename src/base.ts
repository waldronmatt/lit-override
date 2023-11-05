import { LitElement, ReactiveElement } from 'lit';
import { DedupeMixin, wasApplied } from './dedupe.js';
import { emit } from './event.js';

type Constructor<T = Record<string, unknown>> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
  prototype: T;
};

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface MyInterface {}

export const LitBaseMixin = <T extends Constructor<ReactiveElement>>(constructor: T): T & Constructor<MyInterface> => {
  if (wasApplied(LitBaseMixin, constructor)) {
    return <T & Constructor<MyInterface>>constructor;
  }
  class LitBase extends constructor {
    connectedCallback(): void {
      super.connectedCallback();

      emit(this, 'connected-callback');
    }

    willUpdate(): void {
      emit(this, 'will-update');
    }

    firstUpdated(): void {
      emit(this, 'first-updated');
    }

    updated(): void {
      emit(this, 'updated');

      this.updateComplete.then(() => {
        emit(this, 'update-complete');
      });
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();

      emit(this, 'disconnected-callback');
    }
  }

  DedupeMixin(LitBaseMixin, LitBase);

  return LitBase;
}

/**
 * Cipublic Base Class
 *
 * @fires connected-callback
 * @fires will-update
 * @fires first-updated
 * @fires updated
 * @fires update-complete
 * @fires disconnected-callback
 */
export class LitWrapper extends LitBaseMixin(LitElement) {}
