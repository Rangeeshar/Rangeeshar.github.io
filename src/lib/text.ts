/** Escapes HTML, then renders **text** as a highlighted metric. Content comes from src/data. */
export const highlight = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
    .replace(/\*\*(.+?)\*\*/g, '<strong class="metric">$1</strong>');
