import { marked } from 'marked';
import katex from 'katex';

marked.setOptions({ breaks: true, gfm: true });

export function renderContent(raw) {
  if (!raw) return '';

  const slots = [];

  // Protect display math $$...$$
  let out = raw.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    slots.push({ display: true, math });
    return `%%MATH${slots.length - 1}%%`;
  });

  // Protect inline math $...$
  out = out.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
    slots.push({ display: false, math });
    return `%%MATH${slots.length - 1}%%`;
  });

  // Parse markdown
  out = marked.parse(out);

  // Re-inject rendered LaTeX
  out = out.replace(/%%MATH(\d+)%%/g, (_, i) => {
    const { display, math } = slots[parseInt(i)];
    try {
      return katex.renderToString(math, { displayMode: display, throwOnError: false, output: 'html' });
    } catch {
      return `<code class="text-red-500">${math}</code>`;
    }
  });

  return out;
}
