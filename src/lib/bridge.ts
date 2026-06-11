import "server-only";

/** Fetch a wire-shape payload from the always-on bridge, if configured. */
export async function fromBridge<T>(path: string): Promise<T | null> {
  const base = process.env.BRIDGE_URL;
  if (!base) return null;
  try {
    const res = await fetch(new URL(path, base), {
      headers: process.env.BRIDGE_TOKEN
        ? { Authorization: `Bearer ${process.env.BRIDGE_TOKEN}` }
        : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
