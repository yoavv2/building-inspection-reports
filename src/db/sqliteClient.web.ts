/**
 * Web shim for the mobile SQLite client.
 *
 * The app's canonical runtime is native Expo. On web we avoid importing
 * `expo-sqlite` entirely and fail with a clear message if repository code
 * is invoked.
 */

export const WEB_SQLITE_UNSUPPORTED_MESSAGE =
  'גרסת הדפדפן אינה תומכת במסד הנתונים המקומי של האפליקציה. יש לפתוח את הפרויקט ב-Expo Go תואם, בסימולטור iOS או על Android.';

export async function getDb(): Promise<never> {
  throw new Error(WEB_SQLITE_UNSUPPORTED_MESSAGE);
}

export async function initDatabase(): Promise<void> {
  // No-op on web. The root layout renders an unsupported-runtime message instead.
}

export async function runMigrations(): Promise<void> {
  // No-op on web. Migrations only apply to the native SQLite runtime.
}
