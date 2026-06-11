export const dynamic = "force-dynamic";

const MEDIA_URL =
  "https://media.githubusercontent.com/media/AgentWorkforce/vibe-city-game/main/demo.mp4";

// GitHub serves the LFS video as application/octet-stream with nosniff, which
// browsers refuse to play. Stream it through with a real video MIME type and
// Range passthrough (Safari requires 206s for seeking).
export async function GET(req: Request) {
  const range = req.headers.get("range");
  const upstream = await fetch(MEDIA_URL, {
    headers: range ? { range } : undefined,
    cache: "no-store",
  });
  if (!upstream.ok && upstream.status !== 206) {
    return new Response(null, { status: 404 });
  }
  const headers = new Headers({
    "content-type": "video/mp4",
    "accept-ranges": "bytes",
    // versioned by ?v=<oid> from /api/video-meta, so cache hard
    "cache-control": "public, s-maxage=86400, max-age=3600, immutable",
  });
  for (const h of ["content-length", "content-range"]) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }
  return new Response(upstream.body, { status: upstream.status, headers });
}
