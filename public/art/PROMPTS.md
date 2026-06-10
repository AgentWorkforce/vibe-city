# Art generation prompts — GTA: VIBE CITY

Drop generated files into this directory with these exact names and the site
picks them up automatically (the hand-drawn SVG renders as fallback until then):

| File | Slot | Size / format |
| --- | --- | --- |
| `hero.jpg` | Hero background | 1920×1200, JPG |
| `portrait-foreman.png` | The Foreman dossier | ~1200×1500, PNG, transparent bg |
| `portrait-architect.png` | World Architect dossier | same |
| `portrait-physics.png` | Physics Lead dossier | same |
| `portrait-missions.png` | Mission Designer dossier | same |
| `portrait-traffic.png` | Traffic Director dossier | same |
| `portrait-swarm.png` | QA Swarm dossier | same |
| `portrait-generic.png` | Fallback for unknown agents | same |

## Shared style block (append to every prompt)

> Painterly digital illustration in the style of modern video-game key art:
> confident brushwork, soft painted gradients, cel-shaded forms with visible
> brush texture, warm low-sun lighting with strong rim light. Palette:
> periwinkle sky #7d8df0, lavender buildings #b3a5ef, blush pink #efc8da,
> cream highlights #fdf0d5, teal water #7fd4d4, deep indigo shadows #3d3473,
> gold accents #ffc55c. No text, no logos, no watermarks, no humans.

## hero.jpg

> Wide key-art scene of a pastel Miami-like bay at golden hour. A low warm sun
> over teal water with a shimmering glitter path, hazy lavender skyline with
> sunlit building faces, an elevated highway bridge sweeping across the bay on
> piers, soft pink clouds with warm undersides, a small helicopter silhouette
> high in the sky. In the foreground a wooden boardwalk pier with two charming
> robots: a stocky indigo robot wearing a gold hard hat carrying rolled
> blueprints, and a small hovering single-eyed drone beside it. Tall purple
> palm-tree silhouettes frame the left and right edges. The bottom 25% of the
> image fades toward near-black for text overlay. Composition leaves the top
> middle clear for a logo. + shared style block

## Portraits (all transparent-background, full body, slight low angle, feet on ground, character fills ~85% of frame height)

- `portrait-foreman.png` — Stocky indigo robot foreman, gold hard hat, cream
  visor face with two friendly rectangular eyes, carrying rolled cream
  blueprints under one arm, confident stance. Warm sunset rim light from the
  left.
- `portrait-architect.png` — Slender indigo robot wearing a flat lavender
  architect's cap, holding up a small glowing lavender skyscraper model in one
  hand, studying it.
- `portrait-physics.png` — Indigo robot with gold lab goggles pushed up on its
  head, dangling a teal pendulum ball from one outstretched hand, head tilted
  with curiosity.
- `portrait-missions.png` — Indigo robot wearing a hot-pink beret, holding a
  film clapperboard, theatrical pose mid-gesture.
- `portrait-traffic.png` — Indigo robot in an orange peaked traffic cap holding
  up an orange octagonal stop paddle, stern but endearing.
- `portrait-swarm.png` — A trio of hovering round indigo drones with single
  large teal camera eyes and small rotors, arranged as a chevron formation,
  one large and two small wingmen.
- `portrait-generic.png` — Friendly indigo robot giving a thumbs up, plain
  chassis, cream visor with two dot eyes.

## Consistency tips

- Generate the foreman first; feed it back as a style/character reference for
  the other portraits so the chassis design stays consistent.
- Ask for "isolated character on transparent background" — if the tool can't
  do transparency, request a flat #00ff00 background and key it out.
- The dossier panels place portraits bottom-anchored at ~320px tall; export
  with minimal padding below the feet.
