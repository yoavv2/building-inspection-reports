/**
 * Simple module-level state to pass selected standard reference back from picker screen.
 * In a larger app this would use a Zustand store.
 */
import { StandardReference } from '../../types/domain';

let _selected: StandardReference | null = null;
let _listener: ((s: StandardReference) => void) | null = null;

export function setSelectedStandard(standard: StandardReference): void {
  _selected = standard;
  _listener?.(standard);
}

export function getSelectedStandard(): StandardReference | null {
  return _selected;
}

export function onStandardSelected(cb: (s: StandardReference) => void): () => void {
  _listener = cb;
  return () => { _listener = null; };
}

export function clearSelectedStandard(): void {
  _selected = null;
}
