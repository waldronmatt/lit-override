import {css} from 'lit';

export const buttonStyles = css`
  :host {
    --button-color: #0000E0;

    display: inline-block;
    padding: 1.5rem;
    margin-top: 1rem;
  }

  button {
    font-size: 1.5rem;
    font-weight: bold;
  }

  button:hover {
    color: #000;
  }

  button:hover ~ ::slotted([slot='icon']) {
    color: #000;
  }

  ::slotted([slot='icon']) {
    width: 1.5rem;
  }
`;
