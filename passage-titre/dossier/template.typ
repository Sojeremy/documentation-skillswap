// =============================================================================
// Template Typst — Dossier de Projet CDA SkillSwap
// =============================================================================
// Format A4, marges 2.5cm, Inter (fallback sans-serif), JetBrains Mono (fallback monospace)
// Code blocks en thème light obligatoire (exigence O'clock)
// =============================================================================

#let accent = rgb("#FF6B35")
#let accent-soft = rgb("#FFF1EB")
#let code-bg = rgb("#f6f8fa")
#let code-border = rgb("#d0d7de")
#let muted = rgb("#57606a")

// -----------------------------------------------------------------------------
// Style code block (thème light)
// -----------------------------------------------------------------------------
#let code-block(body, lang: none) = {
  block(
    fill: code-bg,
    stroke: 1pt + code-border,
    radius: 4pt,
    inset: 8pt,
    width: 100%,
    text(font: ("JetBrains Mono", "DejaVu Sans Mono", "Courier New"), size: 9pt, body),
  )
}

// -----------------------------------------------------------------------------
// Page de garde
// -----------------------------------------------------------------------------
#let page-de-garde(
  candidat: "Jérémy [NOM_DE_FAMILLE]",
  date-soutenance: "Mardi 13 mai 2026",
  url-prod: "https://skill-swap.fr",
  url-doc: "https://skillswap-docs.vercel.app",
) = {
  set page(
    margin: (top: 4cm, bottom: 4cm, left: 2.5cm, right: 2.5cm),
    background: place(top + left, rect(width: 100%, height: 8pt, fill: accent)),
  )

  v(1fr)

  align(center)[
    #text(size: 14pt, fill: muted, weight: "regular")[Dossier de Projet]
    #v(0.3em)
    #text(size: 28pt, weight: "bold")[SkillSwap]
    #v(0.5em)
    #text(size: 14pt, fill: muted)[Plateforme communautaire d'échange de compétences]
  ]

  v(2cm)

  align(center)[
    #line(length: 40%, stroke: 0.5pt + accent)
  ]

  v(2cm)

  align(center)[
    #text(size: 11pt)[Présenté par]
    #v(0.3em)
    #text(size: 14pt, weight: "semibold")[#candidat]
    #v(1.5em)
    #text(size: 11pt)[en vue de l'obtention du]
    #v(0.3em)
    #text(size: 13pt, weight: "semibold")[Titre Professionnel Concepteur Développeur d'Applications]
    #v(0.2em)
    #text(size: 11pt, fill: muted)[(Niveau 6 — RNCP)]
  ]

  v(2cm)

  align(center)[
    #text(size: 11pt)[École O'clock — Promotion Dublin]
    #v(0.3em)
    #text(size: 11pt, fill: muted)[Soutenance : #date-soutenance]
  ]

  v(1fr)

  align(center)[
    #text(size: 9pt, fill: muted)[
      Application en production : #link(url-prod)[#url-prod] \
      Documentation technique : #link(url-doc)[#url-doc]
    ]
  ]
}

// -----------------------------------------------------------------------------
// Template principal
// -----------------------------------------------------------------------------
#let dossier(
  candidat: "Jérémy [NOM_DE_FAMILLE]",
  date-soutenance: "Mardi 13 mai 2026",
  body,
) = {
  // Métadonnées PDF
  set document(
    title: "Dossier de Projet — SkillSwap",
    author: candidat,
  )

  // Police par défaut
  set text(
    font: ("Inter", "DejaVu Sans", "Liberation Sans"),
    size: 11pt,
    lang: "fr",
  )

  // Liens en couleur d'accent
  show link: it => text(fill: accent, it)

  // Code inline
  show raw.where(block: false): it => box(
    fill: code-bg,
    stroke: 0.5pt + code-border,
    inset: (x: 3pt, y: 1pt),
    outset: (y: 2pt),
    radius: 2pt,
    text(font: ("JetBrains Mono", "DejaVu Sans Mono"), size: 9pt, it),
  )

  // Code block
  show raw.where(block: true): it => code-block(it)

  // Headings numérotés 1.1.1.
  set heading(numbering: "1.1.1.")
  show heading.where(level: 1): it => {
    pagebreak(weak: true)
    v(1em)
    block(text(size: 20pt, weight: "bold", fill: accent, it))
    v(0.5em)
  }
  show heading.where(level: 2): it => {
    v(0.8em)
    block(text(size: 14pt, weight: "semibold", it))
    v(0.2em)
  }
  show heading.where(level: 3): it => {
    v(0.5em)
    block(text(size: 12pt, weight: "semibold", fill: muted, it))
  }

  // -------- Page de garde --------
  page-de-garde(candidat: candidat, date-soutenance: date-soutenance)

  // -------- Sommaire --------
  set page(
    margin: 2.5cm,
    numbering: "1 / 1",
    number-align: center + bottom,
    header: align(right, text(size: 8pt, fill: muted)[
      Dossier de Projet — SkillSwap
    ]),
  )
  counter(page).update(1)

  pagebreak()
  heading(level: 1, numbering: none)[Sommaire]
  outline(
    title: none,
    depth: 3,
    indent: auto,
  )

  // -------- Corps --------
  body
}
