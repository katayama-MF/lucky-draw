# マグナスクール Design System

Design system for **マグナ English School (マグナスクール)** — a kids' online-English
EdTech brand by **ミントフラッグ株式会社 (Mintflag Inc.)**. It powers the shared
top-page LP that is the common entry point to the two courses, **マグナメソッド**
(1-on-1 coaching) and **マグナパーティ** (group lessons); the 英検®チャレンジ course
also appears as a supporting option.

Brand promise: **「遊びが最高のEnglishタイム!」** ("Play is the best English time!").
The differentiator is **ファンラーニング (Fun Learning)** — a dedicated app × online
lessons combo where kids build English through play, driven by self-efficacy
(自己効力感), not drilling. Everything is **mobile-first (SP優先)** and written for
the **parent (保護者, 30–55)** — the user is always the subject.

Namespace for components: `window.DesignSystem_cd3c19`.

## Sources
- Codebase (read-only, mounted): `マグナTOPサイト/` — copied into `_source/`:
  - `_source/v18-sp-mock.html` — the schooltop LP v18 SP mock (エストリンクス方針反映). Ground truth for palette, layout, components, copy.
  - `_source/schooltop-mtg.txt` — Zoom meeting transcript. Key directives: subject = parent; don't over-claim data (all numbers sample / 差し替え前提); emphasize the self-made **app** (a school building its own app is rare) & トレジャーボックス; Fun Learning = self-efficacy (勝手にやる → 褒められる → 話せると信じられる子); avoid generic "英会話スクール" positioning.
- `uploads/logo.png` → `assets/magna-logo.png` — primary logo (kids + globe + マグナ English School, multicolor).
- `uploads/Screenshot 2026-07-04…png` → `assets/golden-age-reference.png` — ゴールデンエイジ(シナプス密度)参考グラフ。サンプル扱い、体験会資料の正規グラフに差し替え予定。
- v18レビュー指摘(片山社長・2026-07)は `ui_kits/schooltop/README.md` に反映済み — 3スクール構成、保護者主語、自己効力感ベースの3便益、返金保証削除、英検合格率+単語数訴求、忘却曲線撤去→ゴールデンエイジ。
- Live FV banner referenced by the LP: `https://magna-eikaiwa.mintflag.com/wp-content/uploads/2025/12/fv_sp.webp` (external; treat as 差し替え placeholder).

## CONTENT FUNDAMENTALS
- **Subject is always the parent/user.** Frame benefits as the parent's experience
  ("うちの子がこんなに続くなんて"), never as vendor bragging ("当社はNo.1").
- **Warm, positive, never pushy.** No urgency/pressure ("今すぐ申し込まないと損"),
  no rushed diagnosis funnels. Floating CTA stays low-pressure ("2つのコースをチェック").
- **Question-led, empathetic openers** to the parent: "楽しみながら英語を身につけられる
  秘密、知っていますか?", "「勉強しなさい」と言わなくても —".
- **Casing:** section eyebrows are short English uppercase (`FOR PARENTS & KIDS`,
  `RESULTS`, `HOW IT WORKS`, `FAQ`); headings & body are Japanese.
- **Emoji are part of the voice** — used as friendly icons in context (😆😊🗣️🎮👥🛡️🎁✨),
  but not spammed. See ICONOGRAPHY.
- **Data honesty:** every stat/graph carries a disclaimer — "※数値は過去実績に基づく
  参考値です。実データは確認のうえ差し替え予定。" Never state numbers as hard fact.
- **Numbers with hedges** ("英語を口にする子も", "…なっています") over absolute claims.

## VISUAL FOUNDATIONS
- **Palette:** bright & friendly on white. Three signature hues — **yellow #FBBF24**,
  **pink #EC4899**, **mint #2DB39A** — plus sky, blue, purple (英検), green (話せる/成功),
  red (期間限定). White surfaces keep body copy readable. See `tokens/colors.css`.
- **Course colour coding:** メソッド = amber, パーティ = pink, 英検 = purple. Applied to
  card top-borders, badges, CTAs.
- **Type:** rounded, pop. Base **M PLUS Rounded 1c**; Latin/numeral display **Baloo 2**.
  Headings heavy (800–900) & impactful; body comfortably large & bold (≥500, ~14px SP)
  for parents — thin/small text is avoided. `tokens/typography.css`.
  - ⚠️ **Font substitution:** the source LP used the system stack (Hiragino Sans / Yu
    Gothic / Meiryo). We chose M PLUS Rounded 1c + Baloo 2 (Google Fonts, loaded via
    `@import` in `tokens/fonts.css`) to give the brand a distinct rounded personality
    that fits kids-EdTech. **Please confirm** — or supply official font files to swap in.
    (Because fonts load via `@import`, the compiler reports "Fonts: 0"; this is expected.)
- **Shape language:** soft rounded cards (radius 12–20px, phone screen 28px, pills 999px).
- **Shadows:** signature **"pop"** hard-offset sticker shadows (`0 3px 0` / `0 4px 0`
  rgba(0,0,0,.08)); soft ambient card shadows for depth; pink glow for hero cards; a
  float shadow for the sticky bottom bar. `tokens/spacing.css`.
- **Backgrounds:** white base; playful multi-radial "confetti" wash on hero/intro
  (`--wash-playful`), sunny yellow gradient (`--grad-sunny`), soft per-hue section tints.
- **Decorative motifs:** speech bubbles with tails; dashed 2px borders on callouts;
  rotated cards (±1.5°) for the app × school "formula"; gradient-text big numbers
  (pink→amber); white text-outline on hero titles; a striped-dashed **image placeholder**
  pattern that signals 差し替え-前提 imagery (method/party/eiken tinted).
- **Animation:** gentle — fade-in on tab change, `pop` scale-rotate on sparkle emoji, a
  slow shine sweep on the primary sticky CTA. Nothing aggressive; respect calm tone.
- **Hover/press:** buttons translate 1px on the pop shadow (press-in feel); links darken
  / soft-tint background; CTAs slight opacity or -1px lift.
- **Layout:** mobile-first single column; sticky top nav; sticky low-pressure bottom CTA
  (hidden while FV in view); page-top button after scroll.

## ICONOGRAPHY
- **Emoji are the primary icon language** — expressive, friendly, always in-context. They
  are intentional brand voice, not filler. Curated set in `guidelines/brand-iconography.html`.
- **Line SVG** used sparingly for pure UI affordances (e.g. the page-top chevron in the
  source). No icon font, no sprite in the source. If a broader UI-icon set is ever needed,
  substitute a rounded stroke set (e.g. Lucide) to match the soft type — flag when done.
- **No hand-drawn brand illustration is reproduced.** The logo (`assets/magna-logo.png`)
  is the only real brand mark; character art / photos are 差し替え placeholders.

## Foundations (Design System tab cards)
- **Colors:** brand core, full ramp, accents & semantic, ink & surfaces, course coding, gradients.
- **Type:** scale, families, weights.
- **Spacing:** scale, radii, shadows.
- **Brand:** logo, iconography (emoji), voice & tone, image-placeholder pattern.

## Components
Reusable primitives extracted from the LP's real vocabulary. Mount from
`window.DesignSystem_cd3c19`.
- **Button** — rounded pop-shadow CTA; variants primary / course / soft / ghost (`components/Button/`)
- **Badge** — pill for course/campaign/target tags (`components/display/`)
- **Card** — soft rounded surface, course-coded top border (`components/display/`)
- **SectionHeading** — eyebrow + heavy title + yellow-marker emphasis (`components/display/`)
- **Disclaimer** — mandatory ※ data-honesty note (`components/display/`)
- **SpeechBubble** — tailed friendly-aside bubble (`components/content/`)
- **StatBadge** — gradient big-number stat tile (`components/content/`)
- **VoiceCard** — testimonial with photo placeholder (`components/content/`)
- **FaqItem** — accordion Q&A (`components/content/`)
- **ImagePlaceholder** — 差し替え-前提 striped image slot (`components/media/`)
- **ComboFormula** — スクール × アプリ rotated-tile formula (`components/media/`)

## Index / manifest
- `styles.css` — global entry (imports the four token layers). Consumers link this.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`.
- `guidelines/` — foundation specimen cards (Colors / Type / Spacing / Brand).
- `components/` — React primitives (`<Name>.jsx` + `.d.ts` + `.prompt.md` + card).
- `assets/` — `magna-logo.png`.
- `_source/` — copied ground-truth files from the mounted codebase.
- `ui_kits/schooltop/` — SP LP **v19** (index.html + SectionsTop/Mid/Bottom.jsx + README — 片山レビュー反映の変更履歴付き).
- `SKILL.md` — Agent-Skills-compatible entry.

## Caveats / open items
- Font choice is a **substitution pending confirmation** (see VISUAL FOUNDATIONS).
- All stats/graphs are **sample data**; real figures must be supplied before launch.
