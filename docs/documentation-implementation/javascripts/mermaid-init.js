// Initialise Mermaid pour le rendu des blocs ```mermaid``` dans MkDocs Material.
// Fallback robuste pour les builds où pymdownx.superfences ne charge pas la lib
// nativement (cas observé sur Vercel : code rendu en plain text).
document.addEventListener('DOMContentLoaded', function () {
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: { htmlLabels: true, curve: 'basis' },
      sequence: { actorMargin: 50, messageMargin: 35 },
    });
  }
});
