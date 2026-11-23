# Workbook design system

## Direction

A warm technical workbook with restrained neo-brutalist controls. The approved reference has paper surfaces, JetBrains Mono, pistachio/olive actions, peach labels, fine grid lines and modest offset shadows. Prefer calm reading surfaces over large saturated color blocks. Preserve legibility and generous touch targets over copying a static mockup literally.

## Palette and roles

Deployed web tokens are defined on the body in `apps/web/astro/pages/[...path].astro`; the retained `apps/web/index.html` is the Vite test harness. The tokens, with dark variants selected by the root `.dark` class. The existing Tailwind and shadcn aliases consume those tokens. Do not introduce a second palette in a component or a new stylesheet.

| Role            | Light     | Dark      | Use                                     |
| --------------- | --------- | --------- | --------------------------------------- |
| `page`          | `#f4ebe0` | `#211e1a` | Main canvas                             |
| `surface`       | `#f8f0e6` | `#26231e` | Cards, banners, popovers                |
| `sidebar-bg`    | `#eee5d8` | `#25211c` | Navigation                              |
| `surface-hover` | `#e9dfd0` | `#302b24` | Quiet interactive fill                  |
| `ink`           | `#1d1b18` | `#efe6d6` | Main copy                               |
| `muted-ink`     | `#6f6961` | `#b5aa99` | Supporting copy                         |
| `line`          | `#c8bdad` | `#51493e` | Panel boundaries                        |
| `green`         | `#40562b` | `#c1d6a3` | Links, focus and accent text            |
| `green-soft`    | `#d1dfa6` | `#3f4c2b` | Selected navigation, small status fills |
| `button-fill`   | `#cddd9d` | `#4b5e2f` | Primary actions                         |
| `button-ink`    | `#1d1b18` | `#efe6d6` | Text on primary actions                 |
| `edge`          | `#29251f` | `#c6bfb7` | Action outline and offset shadow        |
| `peach`         | `#f6d3b5` | `#f6d3b5` | Small labels, always dark ink           |
| `violet`        | `#e7ddf5` | `#493563` | Optional small explanatory callouts     |

Use `bg-page`, `bg-surface`, `text-ink`, `text-muted-ink`, `border-line`, `text-green` and `bg-green-soft` for standard components. For action fills use `bg-[var(--button-fill)] text-[var(--button-ink)]`. Never use the accent-text token as an action fill without checking contrast. Shadcn background, foreground, card, popover, primary, secondary, muted, accent, border, input and ring aliases must follow these roles.

Avoid full-width purple banners, legacy forest-green buttons, blue-gray chrome and unthemed white surfaces. A prominent learning-path banner uses `bg-surface`, `border-line` and an olive accent. Category badges use quiet workbook surfaces. Status colors may communicate warning/error; pair them with a label or icon. Syntax highlighting is a separate reading system and intentionally retains distinct token colors and a dark code canvas.

## Typography and space

Self-hosted `JetBrains Mono Variable` is the web font. Use readable 14–16px body and control text, relaxed prose line height, and bold headings. Reserve 12px text for brief labels, not explanations. Allow long labels to wrap; use `min-w-0` on flexible content. Keep mobile touch targets at least 44px. Content should reflow rather than shrink to fit a desktop composition.

## Components

- Theme control: one outlined pill containing sun and moon. Exactly one mode is selected; explicit selection persists. A new visitor can still inherit system preference before choosing. Do not restore the separate monitor button without a product decision.
- Primary buttons: thin edge outline, 8px rounding, pistachio/olive fill, 2px offset shadow. Secondary actions use a paper surface. Keep focus clearly visible.
- Cards: subtle border and 8–12px corners. Offset shadows belong mainly to actions, not every panel.
- Grid backgrounds: sparse low-contrast lines inside visual/learning cards only. Never interfere with long-form reading.
- Navigation: Learn, Practice and supporting workspace groups. Selected entries have a quiet olive/pistachio fill. Preserve links when reorganizing.
- Learning content: reveal hints and reference solutions deliberately; keep reading, confidence and demonstrated practice distinct.

## Motion and accessibility

No decorative perpetual motion. Prefer immediate keyboard feedback, restrained color changes and transform/opacity when motion clarifies a state change. Respect reduced motion. Check normal text contrast at 4.5:1 and meaningful control/focus contrast at 3:1. Never rely on color alone.

## Review checklist

Inspect home, topics, lesson reader, learning paths, practice, roadmap, account/error states and mobile navigation in both modes. Check the actual computed palette and font, not only class names. Test the theme pill, search and keyboard focus. Verify phone/tablet layouts for overflow. Keep syntax highlights and intentional educational illustrations distinguishable from obsolete UI colors.
