import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import LogoutButton from "@/components/admin/LogoutButton";
import { LogoMark, IconUser, IconBriefcase, IconChevronRight, IconClock } from "@/components/ui/Icons";

export const dynamic = "force-dynamic";

async function countRows(table: string): Promise<number | null> {
  const { count, error } = await getSupabaseAdmin()
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) return null;
  return count ?? 0;
}

function ReportCard({
  href,
  accent,
  title,
  count,
  subtitle,
  icon,
}: {
  href: string;
  accent: "peach" | "lavender";
  title: string;
  count?: number | null;
  subtitle?: string;
  icon: React.ReactNode;
}) {
  const accentBg = accent === "peach" ? "var(--app-peach)" : "var(--app-lavender)";
  const cardClass = accent === "lavender" ? "fw-path-card fw-path-card--lavender" : "fw-path-card";
  return (
    <Link href={href} className={cardClass}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          flexShrink: 0,
          background: accentBg,
          color: "var(--app-plum)",
          display: "grid",
          placeItems: "center",
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>{title}</div>
        <div style={{ fontSize: 14, color: "var(--tm-text-tertiary)", marginTop: 4 }}>
          {subtitle ??
            (count === null || count === undefined
              ? "—"
              : `${count} response${count === 1 ? "" : "s"}`)}
        </div>
      </div>
      <div style={{ marginTop: 4, color: "var(--tm-text-tertiary)" }}>
        <IconChevronRight size={22} />
      </div>
    </Link>
  );
}

export default async function AdminHomePage() {
  const [patientCount, therapistCount] = await Promise.all([
    countRows("patient_responses"),
    countRows("therapist_responses"),
  ]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--tm-bg-canvas)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "clamp(28px, 5vw, 56px) 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 36,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LogoMark size={32} stroke={2.6} />
            <span
              style={{
                fontFamily: "var(--tm-font-display)",
                fontSize: 21,
                color: "var(--tm-text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              Findwell
            </span>
          </div>
          <LogoutButton />
        </div>

        <div
          style={{
            fontFamily: "var(--tm-font-sans)",
            fontSize: 12.5,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--tm-text-tertiary)",
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          Admin
        </div>
        <h1
          style={{
            fontFamily: "var(--tm-font-sans)",
            fontWeight: 600,
            fontSize: "clamp(26px, 3vw, 34px)",
            lineHeight: 1.1,
            letterSpacing: "-0.015em",
            color: "var(--tm-text-primary)",
            margin: "0 0 28px",
          }}
        >
          Survey results
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <ReportCard
            href="/admin/patient"
            accent="peach"
            title="Patient Survey"
            count={patientCount}
            icon={<IconUser />}
          />
          <ReportCard
            href="/admin/therapist"
            accent="lavender"
            title="Therapist Survey"
            count={therapistCount}
            icon={<IconBriefcase />}
          />
          <ReportCard
            href="/admin/activity"
            accent="peach"
            title="Activity"
            subtitle="Visits, and how many started vs finished"
            icon={<IconClock size={18} />}
          />
        </div>
      </div>
    </div>
  );
}
