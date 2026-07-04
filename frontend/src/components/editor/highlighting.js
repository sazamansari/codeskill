import { SYNTAX_KEYWORDS } from "../../config/languages";

export function highlightCode(code, lang) {
  let h = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Multi-line comments
  h = h.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="hl-cm">$1</span>');
  // Single-line comments
  h = h.replace(/(\/\/[^\n]*)/g, '<span class="hl-cm">$1</span>');
  h = h.replace(/(#[^\n]*)/g, '<span class="hl-cm">$1</span>');
  // Strings
  h = h.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="hl-st">$1</span>');
  h = h.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="hl-st">$1</span>');
  h = h.replace(/(`(?:[^`\\]|\\.)*`)/g, '<span class="hl-st">$1</span>');
  // Keywords
  const kw = SYNTAX_KEYWORDS[lang] || SYNTAX_KEYWORDS.python;
  h = h.replace(new RegExp(`\\b(${kw})\\b`, "g"), '<span class="hl-kw">$1</span>');
  // Numbers
  h = h.replace(/\b(\d+\.?\d*)\b/g, '<span class="hl-nm">$1</span>');
  // Function calls
  h = h.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, (m, name) => {
    if ((SYNTAX_KEYWORDS[lang] || "").includes(name)) return m;
    return `<span class="hl-fn">${name}</span>`;
  });
  // Decorators
  h = h.replace(/(@\w+)/g, '<span class="hl-dc">$1</span>');

  return h;
}
