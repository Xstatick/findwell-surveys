"use client";

import Link from "next/link";
import BrandPanel from "@/components/ui/BrandPanel";
import { IconUser, IconBriefcase, IconChevronRight } from "@/components/ui/Icons";

function PathCard({
  href,
  accent,
  title,
  detail,
  icon,
}: {
  href: string;
  accent: "peach" | "lavender";
  title: string;
  detail: string;
  icon: React.ReactNode;
}) {
  const accentBg = accent === "peach" ? "var(--app-peach)" : "var(--app-lavender)";
  const cardClass = accent === "lavender" ? "fw-path-card fw-path-card--lavender" : "fw-path-card";
  return (
    <Link href={href} className={cardClass}>
      <div style={{
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        background: accentBg, color: "var(--app-plum)",
        display: "grid", placeItems: "center",
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>{title}</div>
        <div style={{
          fontSize: 14, color: "var(--tm-text-tertiary)",
          marginTop: 4, lineHeight: 1.5,
        }}>{detail}</div>
      </div>
      <div style={{ marginTop: 4, color: "var(--tm-text-tertiary)" }}>
        <IconChevronRight size={22} />
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="qc-shell">
      <BrandPanel
        eyebrow="Discovery research"
        headline={
          <>
            finding therapy<br />
            <em style={{ fontStyle: "italic" }}>is broken.</em>
          </>
        }
        support="Two anonymous surveys — one for therapists, one for anyone who has thought about therapy. We're a small team, including a practicing clinical psychologist, researching how people experience finding mental health support. Tell us your side."
      >
        <div style={{
          display: "flex", flexDirection: "column", gap: 14, marginTop: 8,
          fontFamily: "var(--tm-font-display)", fontStyle: "italic",
          fontSize: 18, color: "var(--tm-text-secondary)", lineHeight: 1.55,
          maxWidth: 420,
        }}>
          <span>— this should take about ten minutes.</span>
        </div>
      </BrandPanel>

      <main className="qc-content-pane">
        <div className="qc-content-inner" style={{ justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{
              fontFamily: "var(--tm-font-sans)", fontSize: 12.5, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "var(--tm-text-tertiary)", fontWeight: 600,
            }}>
              Choose your perspective
            </div>

            <h2 style={{
              fontFamily: "var(--tm-font-sans)", fontWeight: 600,
              fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1.1,
              letterSpacing: "-0.015em", color: "var(--tm-text-primary)", margin: 0,
            }}>
              Which side are you on?
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12 }}>
              <PathCard
                href="/patient"
                accent="peach"
                title="I'm sharing my personal experience"
                detail="For anyone who has — or hasn't — considered therapy. Branching questions, about 10 minutes."
                icon={<IconUser />}
              />
              <PathCard
                href="/therapist"
                accent="lavender"
                title="I am a therapist"
                detail="For licensed clinicians. Questions about your practice, referrals, and the screening burden."
                icon={<IconBriefcase />}
              />
            </div>

            <div style={{
              marginTop: 28, fontFamily: "var(--tm-font-sans)", fontSize: 13,
              color: "var(--tm-text-tertiary)",
            }}>
              We don&apos;t collect anything about you unless you opt in at the end.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
