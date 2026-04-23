import { connectDB } from "./mongodb";

/**
 * Reusable database guard wrapper.
 * Ensures DB is connected before running handler.
 * Falls back gracefully if DB is unavailable (build time, no MONGODB_URI, etc.)
 */
export async function withDB<T>(
  handler: () => Promise<T>,
  fallback: () => Promise<T>
): Promise<T> {
  const conn = await connectDB();

  if (!conn) {
    console.warn("⚠️ [dbGuard] DB not connected. Using fallback data.");
    return fallback();
  }

  try {
    return await handler();
  } catch (err: any) {
    console.error("❌ [dbGuard] DB Error:", err.message || err);
    return fallback();
  }
}
