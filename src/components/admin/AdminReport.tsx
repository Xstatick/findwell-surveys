import Link from "next/link";
import { SurveyDefinition, ResponseRow } from "@/lib/types";
import { getColumns } from "@/lib/surveys/columns";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import ResponsesTable from "./ResponsesTable";
import LogoutButton from "./LogoutButton";
import { IconChevronLeft } from "@/components/ui/Icons";

interface AdminReportProps {
  definition: SurveyDefinition;
  tableName: string;
}

export default async function AdminReport({ definition, tableName }: AdminReportProps) {
  const { data, error } = await getSupabaseAdmin()
    .from(tableName)
    .select("*")
    .order("submitted_at", { ascending: false });

  const columns = getColumns(definition);
  const rows = (data ?? []) as ResponseRow[];

  return (
    <div style={{ minHeight: "100vh", background: "var(--tm-bg-canvas)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(24px, 4vw, 40px) clamp(20px, 4vw, 40px)" }}>
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
            fontFamily: "var(--tm-font-sans)",
            fontWeight: 600,
            fontSize: "clamp(24px, 3vw, 30px)",
            letterSpacing: "-0.015em",
            color: "var(--tm-text-primary)",
            margin: "0 0 24px",
          }}
        >
          {definition.title}
        </h1>

        {error ? (
          <p style={{ color: "var(--tm-peach-700)", fontFamily: "var(--tm-font-sans)", padding: "48px 0" }}>
            Failed to load responses: {error.message}
          </p>
        ) : (
          <ResponsesTable surveyId={definition.id} columns={columns} rows={rows} />
        )}
      </div>
    </div>
  );
}
