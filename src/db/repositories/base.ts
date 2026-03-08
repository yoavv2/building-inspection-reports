/**
 * Base repository — shared ID generation and timestamp helpers.
 */
import { getDb } from '../sqliteClient';

let _counter = 0;

export function generateId(): string {
  // Simple UUID v4 replacement that works without crypto module in RN
  _counter += 1;
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 9);
  return `${ts}-${rand}-${_counter}`;
}

export function now(): string {
  return new Date().toISOString();
}

export { getDb };
