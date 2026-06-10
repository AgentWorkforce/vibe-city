"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

/**
 * Raster-art slot with a vector fallback. Drop a file at the given /art path
 * (public/art/...) and it replaces the fallback on the next load — no code
 * changes. While the image is missing (404) or still loading, the fallback
 * renders, so the site never shows a broken state.
 */
export function ArtImage({
  src,
  alt = "",
  className,
  imgClassName,
  scrim = false,
  fallback,
}: {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  /** add a bottom scrim over the raster (vector fallbacks bake in their own) */
  scrim?: boolean;
  fallback: React.ReactNode;
}) {
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");
  const ref = useRef<HTMLImageElement>(null);

  // the image can finish (or 404) before hydration attaches onLoad/onError
  useEffect(() => {
    const img = ref.current;
    if (img?.complete) setState(img.naturalWidth > 0 ? "ok" : "missing");
  }, []);

  return (
    <div className={clsx("pointer-events-none", className)}>
      {state !== "missing" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src}
          alt={alt}
          onLoad={() => setState("ok")}
          onError={() => setState("missing")}
          className={clsx(
            "h-full w-full",
            imgClassName ?? "object-cover",
            state !== "ok" && "invisible absolute",
          )}
        />
      )}
      {state === "ok" && scrim && (
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/5"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(5,5,5,0.55) 55%, rgba(5,5,5,0.95) 100%)",
          }}
        />
      )}
      {state !== "ok" && fallback}
    </div>
  );
}
