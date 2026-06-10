"""Stroke-based painterly renderer (after Hertzmann, 'Painterly Rendering with
Curved Brush Strokes of Multiple Sizes', SIGGRAPH 1998).

Takes a source plate (rendered by scripts/render-plates.mjs) and repaints it
with layered curved brush strokes that follow image gradients — coarse strokes
first, finer brushes only where the canvas still deviates from the source.
Output is genuine raster brushwork derived from the composition.

Usage: paint.py <in.png> <out.(png|jpg)> [--alpha] [--grain 0.045]
  --alpha  preserve the source alpha channel (character portraits)
"""

import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

RNG = np.random.default_rng(47)

# brush radii in px at plate resolution, coarse -> fine
RADII = [42, 22, 12, 6, 3]
GRID_FACTOR = 1.0          # spacing between stroke candidates, in radii
ERROR_THRESHOLD = 18.0     # repaint a cell when mean error exceeds this
MAX_STROKE_LEN = 7         # control points per stroke
MIN_STROKE_LEN = 2
CURVATURE_FILTER = 0.6     # blend between previous and new stroke direction
JITTER_HSV = (0.025, 0.06, 0.06)  # hue/sat/val jitter per stroke


def gaussian(arr: np.ndarray, sigma: float) -> np.ndarray:
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(sigma)), dtype=np.float64)


def luminance(rgb: np.ndarray) -> np.ndarray:
    return rgb[..., 0] * 0.299 + rgb[..., 1] * 0.587 + rgb[..., 2] * 0.114


def jitter_color(rgb):
    import colorsys
    h, s, v = colorsys.rgb_to_hsv(*(c / 255.0 for c in rgb))
    jh, js, jv = JITTER_HSV
    h = (h + RNG.uniform(-jh, jh)) % 1.0
    s = float(np.clip(s + RNG.uniform(-js, js), 0, 1))
    v = float(np.clip(v + RNG.uniform(-jv, jv), 0, 1))
    r, g, b = colorsys.hsv_to_rgb(h, s, v)
    return (int(r * 255), int(g * 255), int(b * 255))


def make_stroke(x0, y0, radius, ref, canvas, gx, gy):
    """Curved stroke: walk perpendicular to the gradient from (x0, y0)."""
    h, w = ref.shape[:2]
    color = ref[y0, x0]
    points = [(float(x0), float(y0))]
    x, y = float(x0), float(y0)
    last_dx, last_dy = 0.0, 0.0
    for _ in range(MAX_STROKE_LEN):
        ix, iy = int(x), int(y)
        if not (0 <= ix < w and 0 <= iy < h):
            break
        # stop when the source diverges from the stroke color more than from canvas
        d_color = np.abs(ref[iy, ix] - color).mean()
        d_canvas = np.abs(ref[iy, ix] - canvas[iy, ix]).mean()
        if len(points) > MIN_STROKE_LEN and d_color > d_canvas:
            break
        gxx, gyy = gx[iy, ix], gy[iy, ix]
        mag = np.hypot(gxx, gyy)
        if mag < 0.5:
            # flat region: drift in the previous direction (or stop if new)
            if len(points) == 1:
                ang = RNG.uniform(0, 2 * np.pi)
                dx, dy = np.cos(ang), np.sin(ang)
            else:
                dx, dy = last_dx, last_dy
        else:
            dx, dy = -gyy / mag, gxx / mag       # normal to gradient
            if last_dx * dx + last_dy * dy < 0:  # keep direction continuity
                dx, dy = -dx, -dy
            dx = CURVATURE_FILTER * dx + (1 - CURVATURE_FILTER) * last_dx
            dy = CURVATURE_FILTER * dy + (1 - CURVATURE_FILTER) * last_dy
            n = np.hypot(dx, dy) or 1.0
            dx, dy = dx / n, dy / n
        x, y = x + radius * dx, y + radius * dy
        last_dx, last_dy = dx, dy
        points.append((x, y))
    return points, tuple(int(c) for c in color)


def paint(src_rgb: np.ndarray, radii=RADII) -> Image.Image:
    h, w = src_rgb.shape[:2]
    canvas = np.full_like(src_rgb, 255.0)
    canvas_im = Image.fromarray(canvas.astype(np.uint8))
    draw = ImageDraw.Draw(canvas_im)
    first = True

    for radius in radii:
        ref = gaussian(src_rgb, radius * 0.9)
        lum = luminance(ref)
        gy, gx = np.gradient(lum)
        canvas = np.asarray(canvas_im, dtype=np.float64)
        err = np.abs(canvas - ref).mean(axis=2)

        step = max(2, int(radius * GRID_FACTOR))
        # vectorized per-cell mean error
        gh, gw = h // step, w // step
        cells = err[: gh * step, : gw * step].reshape(gh, step, gw, step).mean(axis=(1, 3))
        ys, xs = np.where(cells > (0 if first else ERROR_THRESHOLD))
        order = RNG.permutation(len(ys))

        for i in order:
            cy, cx = ys[i], xs[i]
            # highest-error pixel within the cell
            block = err[cy * step : (cy + 1) * step, cx * step : (cx + 1) * step]
            by, bx = np.unravel_index(np.argmax(block), block.shape)
            px, py = cx * step + bx, cy * step + by
            pts, color = make_stroke(px, py, radius, ref, canvas, gx, gy)
            color = jitter_color(color)
            width = max(2, int(radius * RNG.uniform(1.5, 2.1)))
            if len(pts) == 1:
                x0, y0 = pts[0]
                draw.ellipse([x0 - radius, y0 - radius, x0 + radius, y0 + radius], fill=color)
            else:
                draw.line(pts, fill=color, width=width, joint="curve")
                for (x0, y0) in (pts[0], pts[-1]):
                    r2 = width / 2
                    draw.ellipse([x0 - r2, y0 - r2, x0 + r2, y0 + r2], fill=color)
        first = False
    return canvas_im


def add_grain(im: Image.Image, amount: float) -> Image.Image:
    arr = np.asarray(im, dtype=np.float64)
    noise = RNG.normal(0, 255 * amount, arr.shape[:2])
    arr[..., :3] = np.clip(arr[..., :3] + noise[..., None], 0, 255)
    return Image.fromarray(arr.astype(np.uint8))


def main():
    args = sys.argv[1:]
    flags = {a for a in args if a.startswith("--") and "=" not in a}
    kv = dict(a.lstrip("-").split("=") for a in args if "=" in a)
    paths = [a for a in args if not a.startswith("--")]
    src_path, out_path = paths

    src = Image.open(src_path).convert("RGBA")
    rgba = np.asarray(src, dtype=np.float64)
    alpha = rgba[..., 3]
    alpha = np.where(alpha < 20, 0.0, alpha)
    rgb = rgba[..., :3].copy()

    keep_alpha = "--alpha" in flags
    if keep_alpha:
        # matte transparent pixels to the nearest content color so edge strokes
        # don't drag in white; dilate content outward with a blurred premultiply
        a = alpha / 255.0
        soft = np.stack([gaussian(rgb[..., c] * a, 6) for c in range(3)], axis=-1)
        asoft = gaussian(alpha, 6) / 255.0
        fill = soft / np.maximum(asoft[..., None], 1e-3)
        rgb = np.where(a[..., None] > 0.5, rgb, np.clip(fill, 0, 255))

    out = paint(rgb)
    out = add_grain(out, float(kv.get("grain", 0.045)))

    if keep_alpha:
        # restore the silhouette with a touch of feather so stroke edges survive;
        # the opening (min->max) kills stray alpha specks before dilation
        a_im = Image.fromarray(alpha.astype(np.uint8))
        a_im = a_im.filter(ImageFilter.MinFilter(5))
        a_im = a_im.filter(ImageFilter.MaxFilter(9))
        a_im = a_im.filter(ImageFilter.GaussianBlur(1.2))
        out = out.convert("RGBA")
        out.putalpha(a_im)
        out.save(out_path)
    else:
        out.convert("RGB").save(out_path, quality=88)
    print(f"painted {src_path} -> {out_path}")


if __name__ == "__main__":
    main()
