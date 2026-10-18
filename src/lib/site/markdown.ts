/**
 * A deliberately small Markdown subset for the site's own document pages
 * (src/content/legal/*.md): headings (#, ##, ###), paragraphs, single-level
 * "- " lists, pipe tables, **bold** and [text](url) links. Anything else is
 * plain text. No HTML passes through, so the output is safe to render.
 */

export type Inline = { kind: 'text'; text: string } | { kind: 'bold'; text: string } | { kind: 'link'; text: string; href: string };

export type Block =
  | { kind: 'heading'; level: 1 | 2 | 3; text: Inline[]; id: string }
  | { kind: 'paragraph'; text: Inline[] }
  | { kind: 'list'; items: Inline[][] }
  | { kind: 'table'; head: Inline[][]; rows: Inline[][][] };

/** Only site paths, https and mailto links are kept; anything else becomes text. */
export function safeHref(href: string): string | null {
  if (/^\/(?!\/)[\w\-./#?=&%]*$/.test(href)) return href;
  if (/^https:\/\/[^\s"'<>]+$/.test(href)) return href;
  if (/^mailto:[^\s"'<>]+$/.test(href)) return href;
  return null;
}

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push({ kind: 'text', text: src.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ kind: 'bold', text: m[1] });
    else {
      const href = safeHref(m[3]);
      out.push(href ? { kind: 'link', text: m[2], href } : { kind: 'text', text: m[2] });
    }
    last = re.lastIndex;
  }
  if (last < src.length) out.push({ kind: 'text', text: src.slice(last) });
  return out;
}

const plain = (inl: Inline[]) => inl.map((i) => i.text).join('');

/** URL fragment for a heading: letters (any script), digits and dashes. */
export function slug(text: string): string {
  return text.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
}

const cells = (line: string) => line.trim().replace(/^\||\|$/g, '').split('|').map((c) => parseInline(c.trim()));
const isTableSep = (line: string) => /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(line);

export function parseMarkdown(src: string): Block[] {
  const lines = src.replace(/\r\n?/g, '\n').split('\n');
  const blocks: Block[] = [];
  const used = new Map<string, number>();
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push({ kind: 'paragraph', text: parseInline(para.join(' ')) });
    para = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) { flush(); continue; }
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      flush();
      const text = parseInline(h[2].trim());
      const base = slug(plain(text)) || 'section';
      const n = used.get(base) ?? 0;
      used.set(base, n + 1);
      blocks.push({ kind: 'heading', level: h[1].length as 1 | 2 | 3, text, id: n ? `${base}-${n + 1}` : base });
      continue;
    }
    if (/^\s*-\s+/.test(line)) {
      flush();
      const items: Inline[][] = [];
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        items.push(parseInline(lines[i].replace(/^\s*-\s+/, '').trim()));
        i++;
      }
      i--;
      blocks.push({ kind: 'list', items });
      continue;
    }
    if (line.trim().startsWith('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      flush();
      const head = cells(line);
      const rows: Inline[][][] = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(cells(lines[i]));
        i++;
      }
      i--;
      blocks.push({ kind: 'table', head, rows });
      continue;
    }
    para.push(line.trim());
  }
  flush();
  return blocks;
}
