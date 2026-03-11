export async function bootstrapDatabase(): Promise<void> {
  // No-op on web. The app intentionally does not bootstrap the native SQLite path there.
}
