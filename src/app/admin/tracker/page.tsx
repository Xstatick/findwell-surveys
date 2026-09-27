import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import { IconChevronLeft } from "@/components/ui/Icons";
import {
  loadTracker,
  tokenizeInline,
  type TrackerBlock,
  type TrackerItem,
  type TrackerSection,
} from "@/lib/tracker";

export const dynamic = "force-dynamic";

function Inline({ text }: { text: string }) {
  return (
    <>
      {tokenizeInline(text).map((t, i) => {
        switch (t.kind) {
          case "strong":
            return <strong key={i}>{t.text}</strong>;
          case "code":
            return <code key={i}>{t.text}</code>;
          case "link":
            return (
              <a key={i} href={t.href} target="_blank" rel="noopener noreferrer">
                {t.href}
              </a>
            );
          default:
            return <span key={i}>{t.text}</span>;
        }
      })}
    </>
  );
}

function Items({ items }: { items: TrackerItem[] }) {
  return (
    <ul>
      {items.map((it, i) => {
        const cls =
          it.checked === null
            ? undefined
            : it.checked
              ? "fw-task fw-task--done"
              : "fw-task";
        return (
          <li key={i} className={cls}>
            {it.checked !== null && <span className="fw-task-box" aria-hidden />}
            <span className="fw-task-text">
              <Inline text={it.text} />
            </span>
            {it.children.length > 0 && <Items items={it.children} />}
          </li>
        );
      })}
    </ul>
  );
}

function statusClass(value: string): string {
  const slug = value.toLowerCase().replace(/\s+/g, "-");
  return `fw-status fw-status--${slug}`;
}

function Blocks({ blocks }: { blocks: TrackerBlock[] }) {
  const metas = blocks.filter((b) => b.kind === "meta");
  return (
    <>
      {metas.length > 0 && (
        <dl className="fw-meta">
          {metas.map((b, i) =>
            b.kind === "meta" ? (
              <div key={i}>
                <dt>{b.key}</dt>
                <dd>
                  {b.key === "Status" ? (
                    <span className={statusClass(b.value)}>{b.value}</span>
                  ) : (
                    <Inline text={b.value} />
                  )}
                </dd>
              </div>
            ) : null,
          )}
        </dl>
      )}
      {blocks.map((b, i) => {
        if (b.kind === "p") {
          return (
            <p key={i}>
              <Inline text={b.text} />
            </p>
          );
        }
        if (b.kind === "list") return <Items key={i} items={b.items} />;
        return null;
      })}
    </>
  );
}

function EpicIndex({ epics }: { epics: TrackerSection[] }) {
  return (
    <nav className="fw-epic-index" aria-label="Epics">
      <ol>
        {epics.map((e) => {
          const pct = e.total === 0 ? 0 : Math.round((100 * e.done) / e.total);
          return (
            <li key={e.slug}>
              <a href={`#${e.slug}`}>
                <span className="fw-epic-index-n">
                  {e.epicNumber?.replace("Epic ", "")}
                </span>
                <span className="fw-epic-index-name">{e.epicName}</span>
                <span className="fw-epic-index-bar" aria-hidden>
                  <span style={{ width: `${pct}%` }} />
                </span>
                <span className="fw-epic-index-count">
                  {e.done} of {e.total}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Section({ s }: { s: TrackerSection }) {
  return (
    <section
      id={s.slug}
      className={s.isEpic ? "fw-tracker-section fw-tracker-section--epic" : "fw-tracker-section"}
    >
      {s.isEpic ? (
        <div className="fw-epic-head">
          <span className="fw-epic-num">{s.epicNumber}</span>
          <h2>{s.epicName}</h2>
          <span className="fw-epic-count">
            {s.done} of {s.total} done
          </span>
        </div>
      ) : (
        <h2>{s.title}</h2>
      )}
      <Blocks blocks={s.blocks} />
      {s.subsections.map((sub) => (
        <div key={sub.title}>
          <h3>
            <Inline text={sub.title} />
          </h3>
          <Blocks blocks={sub.blocks} />
        </div>
      ))}
    </section>
  );
}

export default async function TrackerPage() {
  const tracker = await loadTracker();
  const visible = tracker.sections.filter(
    (s) => s.title && s.title !== "How to use this file",
  );
  const epics = visible.filter((s) => s.isEpic);

  return (
    <div style={{ minHeight: "100vh", background: "var(--tm-bg-canvas)" }}>
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "clamp(24px, 4vw, 40px) clamp(20px, 4vw, 40px) 96px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Link
            href="/admin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontFamily: "var(--tm-font-sans)",
              fontSize: 13.5,
              color: "var(--tm-text-tertiary)",
              textDecoration: "none",
            }}
          >
            <IconChevronLeft size={18} /> All reports
          </Link>
          <LogoutButton />
        </div>

        <h1
          style={{
            fontFamily: "var(--tm-font-display)",
            fontWeight: 400,
            fontSize: "clamp(34px, 5vw, 44px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "var(--tm-text-primary)",
            margin: "0 0 10px",
          }}
        >
          Work tracker
        </h1>
        <p
          style={{
            fontFamily: "var(--tm-font-sans)",
            fontSize: 14.5,
            color: "var(--tm-text-secondary)",
            margin: "0 0 28px",
            lineHeight: 1.5,
            maxWidth: "56ch",
          }}
        >
          Where the build stands, epic by epic. Erika confirms when something is
          done. Last updated {tracker.lastUpdated}. Source:{" "}
          <code>content/work-tracker.md</code>.
        </p>

        <div className="fw-tracker">
          <EpicIndex epics={epics} />
          {visible.map((s) => (
            <Section key={s.slug} s={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
