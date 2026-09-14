/**
 * Whether the visitor has clicked through the entry gate. Shared because the
 * rail has to re-measure once the gate releases the scroll lock — until then
 * `scrollHeight` reflects a locked, single-viewport document.
 */
export const gateState = $state({ entered: false });
