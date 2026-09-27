import { readFile } from "node:fs/promises";
import path from "node:path";

// The work tracker lives in content/work-tracker.md so it can be edited like a
// doc and reviewed in a PR. This module turns that markdown into a small typed
// tree the admin page renders. It understands only the structure the tracker
// uses: "## " sections, "### " sub-sections, "**Key:** value" meta lines,
// bullets, nested bullets, and "- [ ]" / "- [x]" tasks.

export interface TrackerItem {
  text: string;
  checked: boolean | null; // null = plain bullet, not a task
  children: TrackerItem[];
}

export type TrackerBlock =
  | { kind: "p"; text: string }
  | { kind: "meta"; key: string; value: string }
  | { kind: "list"; items: TrackerItem[] };

export interface TrackerSubsection {
  title: string;
  blocks: TrackerBlock[];
}

export interface TrackerSection {
  title: string;
  slug: string;
  isEpic: boolean;
  epicNumber?: string; // "Epic 1"
  epicName?: string; // "Matching model"
  status?: string;
  blocks: TrackerBlock[];
  subsections: TrackerSubsection[];
  done: number;
  total: number;
}

export interface Tracker {
  lastUpdated: string;
  sections: TrackerSection[];
}

const TRACKER_PATH = path.join(process.cwd(), "content", "work-tracker.md");

export async function loadTracker(): Promise<Tracker> {
  const raw = await readFile(TRACKER_PATH, "utf8");
  return parseTracker(raw);
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function countItems(items: TrackerItem[]): { done: number; total: number } {
  let done = 0;
  let total = 0;
  for (const it of items) {
    if (it.checked !== null) {
      total += 1;
      if (it.checked) done += 1;
    }
    const c = countItems(it.children);
    done += c.done;
    total += c.total;
  }
  return { done, total };
}

function countBlocks(blocks: TrackerBlock[]): { done: number; total: number } {
  let done = 0;
  let total = 0;
  for (const b of blocks) {
    if (b.kind === "list") {
      const c = countItems(b.items);
      done += c.done;
      total += c.total;
    }
  }
  return { done, total };
}

export function parseTracker(md: string): Tracker {
  const lines = md.split(/\r?\n/);
  const sections: TrackerSection[] = [];
  let lastUpdated = "";
  let current: TrackerSection | null = null;
  let currentSub: TrackerSubsection | null = null;

  const target = (): TrackerBlock[] => {
    if (currentSub) return currentSub.blocks;
    if (current) return current.blocks;
    // Content before the first heading is ignored, but keep the parser total.
    const orphan: TrackerSection = {
      title: "",
      slug: "",
      isEpic: false,
      blocks: [],
      subsections: [],
      done: 0,
      total: 0,
    };
    current = orphan;
    return orphan.blocks;
  };

  const parseList = (start: number): { items: TrackerItem[]; next: number } => {
    const items: TrackerItem[] = [];
    const stack: { indent: number; list: TrackerItem[] }[] = [
      { indent: 0, list: items },
    ];
    let j = start;
    while (j < lines.length) {
      const m = lines[j].match(/^(\s*)- (\[( |x)\] )?(.*)$/);
      if (!m) break;
      const indent = m[1].length;
      const checked = m[2] === undefined ? null : m[3] === "x";
      const item: TrackerItem = { text: m[4], checked, children: [] };
      while (stack.length > 1 && stack[stack.length - 1].indent > indent) {
        stack.pop();
      }
      const top = stack[stack.length - 1];
      if (top.indent < indent && top.list.length > 0) {
        const parent = top.list[top.list.length - 1];
        stack.push({ indent, list: parent.children });
      }
      stack[stack.length - 1].list.push(item);
      j += 1;
    }
    return { items, next: j };
  };

  let i = 0;
  while (i < lines.length) {
    const ln = lines[i];

    if (ln.startsWith("# ")) {
      i += 1;
      continue;
    }
    if (ln.startsWith("Last updated:")) {
      lastUpdated = ln.replace("Last updated:", "").trim();
      i += 1;
      continue;
    }
    if (ln.startsWith("## ")) {
      const title = ln.slice(3).trim();
      const isEpic = /^Epic \d+:/.test(title);
      const section: TrackerSection = {
        title,
        slug: slugify(title),
        isEpic,
        blocks: [],
        subsections: [],
        done: 0,
        total: 0,
      };
      if (isEpic) {
        const idx = title.indexOf(":");
        section.epicNumber = title.slice(0, idx).trim();
        section.epicName = title.slice(idx + 1).trim();
      }
      sections.push(section);
      current = section;
      currentSub = null;
      i += 1;
      continue;
    }
    if (ln.startsWith("### ")) {
      const sub: TrackerSubsection = { title: ln.slice(4).trim(), blocks: [] };
      if (!current) target();
      current!.subsections.push(sub);
      currentSub = sub;
      i += 1;
      continue;
    }
    if (ln.trim() === "" || ln.trim() === "---") {
      i += 1;
      continue;
    }
    if (/^- /.test(ln)) {
      const { items, next } = parseList(i);
      target().push({ kind: "list", items });
      i = next;
      continue;
    }
    const meta = ln.match(/^\*\*([^*]+):\*\*\s*(.*)$/);
    if (meta) {
      target().push({ kind: "meta", key: meta[1], value: meta[2] });
      if (meta[1] === "Status" && current) current.status = meta[2];
      i += 1;
      continue;
    }
    target().push({ kind: "p", text: ln });
    i += 1;
  }

  for (const s of sections) {
    let c = countBlocks(s.blocks);
    for (const sub of s.subsections) {
      const sc = countBlocks(sub.blocks);
      c = { done: c.done + sc.done, total: c.total + sc.total };
    }
    s.done = c.done;
    s.total = c.total;
  }

  return { lastUpdated, sections };
}

// Inline markdown the tracker uses: **bold**, `code`, and bare URLs.
export type InlineToken =
  | { kind: "text"; text: string }
  | { kind: "strong"; text: string }
  | { kind: "code"; text: string }
  | { kind: "link"; href: string };

export function tokenizeInline(s: string): InlineToken[] {
  const out: InlineToken[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|https?:\/\/[^\s)]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) out.push({ kind: "text", text: s.slice(last, m.index) });
    const tok = m[0];
    if (tok.startsWith("**")) {
      out.push({ kind: "strong", text: tok.slice(2, -2) });
    } else if (tok.startsWith("`")) {
      out.push({ kind: "code", text: tok.slice(1, -1) });
    } else {
      out.push({ kind: "link", href: tok });
    }
    last = m.index + tok.length;
  }
  if (last < s.length) out.push({ kind: "text", text: s.slice(last) });
  return out;
}
