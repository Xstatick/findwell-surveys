import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import LogoutButton from "@/components/admin/LogoutButton";
import { IconChevronLeft } from "@/components/ui/Icons";
import { patientSurvey } from "@/lib/surveys/patient";
import { therapistSurvey } from "@/lib/surveys/therapist";
import {
  dailyVisits,
  totalVisitors,
  surveyFunnel,
  EventRow,
  SurveyFunnel,
} from "@/lib/activity";

export const dynamic = "force-dynamic";

const LOOKBACK_DAYS = 30;
const CHART_DAYS = 14;

function Tile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div
      style={{
        flex: "1 1 160px",
        padding: "18px 20px",
        borderRadius: 16,
        background: "var(--tm-bg-surface)",
        boxShadow: "inset 0 0 0 1px var(--tm-border-default)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--tm-font-sans)",
          fontSize: 12.5,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--tm-text-tertiary)",
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--tm-font-sans)",
          fontSize: 34,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "var(--tm-text-primary)",
          marginTop: 6,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {hint && (
        <div
          style={{
            fontFamily: "var(--tm-font-sans)",
            fontSize: 13,
            color: "var(--tm-text-tertiary)",
            marginTop: 4,
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}

function SectionHeading({
  title,
  detail,
}: {
  title: string;
  detail?: string;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h2
        style={{
          fontFamily: "var(--tm-font-sans)",
          fontWeight: 600,
          fontSize: 20,
          letterSpacing: "-0.01em",
          color: "var(--tm-text-primary)",
          margin: 0,
        }}
      >
        {title}
      </h2>
      {detail && (
        <p
          style={{
            fontFamily: "var(--tm-font-sans)",
            fontSize: 13.5,
            color: "var(--tm-text-tertiary)",
            margin: "4px 0 0",
            lineHeight: 1.5,
          }}
        >
          {detail}
        </p>
      )}
    </div>
  );
}

function FunnelCard({
  title,
  funnel,
}: {
  title: string;
  funnel: SurveyFunnel;
}) {
  const worst = funnel.dropoffs[0]?.count ?? 0;
  return (
    <div
      style={{
        flex: "1 1 340px",
        padding: "22px 24px",
        borderRadius: 18,
        background: "var(--tm-bg-surface)",
        boxShadow: "inset 0 0 0 1px var(--tm-border-default)",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--tm-font-sans)",
          fontWeight: 600,
          fontSize: 17,
          color: "var(--tm-text-primary)",
          margin: "0 0 14px",
        }}
      >
        {title}
      </h3>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 600, color: "var(--tm-text-primary)" }}>
            {funnel.started}
          </div>
          <div style={{ fontSize: 13, color: "var(--tm-text-tertiary)" }}>started</div>
        </div>
        <div>
          <div style={{ fontSize: 26, fontWeight: 600, color: "var(--tm-text-primary)" }}>
            {funnel.completed}
          </div>
          <div style={{ fontSize: 13, color: "var(--tm-text-tertiary)" }}>finished</div>
        </div>
        <div>
          <div style={{ fontSize: 26, fontWeight: 600, color: "var(--tm-text-primary)" }}>
            {funnel.unfinished}
          </div>
          <div style={{ fontSize: 13, color: "var(--tm-text-tertiary)" }}>didn&apos;t finish</div>
        </div>
        <div>
          <div style={{ fontSize: 26, fontWeight: 600, color: "var(--tm-text-primary)" }}>
            {funnel.completionRate === null ? "—" : `${funnel.completionRate}%`}
          </div>
          <div style={{ fontSize: 13, color: "var(--tm-text-tertiary)" }}>finish rate</div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <div
          style={{
            fontFamily: "var(--tm-font-sans)",
            fontSize: 12.5,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--tm-text-tertiary)",
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          Where people stopped
        </div>

        {funnel.dropoffs.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--tm-font-sans)",
              fontSize: 14,
              color: "var(--tm-text-tertiary)",
              margin: 0,
            }}
          >
            {funnel.started === 0
              ? "No one has started this survey yet."
              : "Everyone who started has finished."}
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {funnel.dropoffs.map((d) => (
              <div key={d.questionId}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    fontFamily: "var(--tm-font-sans)",
                    fontSize: 13.5,
                    color: "var(--tm-text-secondary)",
                    marginBottom: 4,
                  }}
                >
                  <span>{d.label}</span>
                  <span
                    style={{
                      color: "var(--tm-text-primary)",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {d.count}
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "var(--tm-bg-muted)",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: worst ? `${(d.count / worst) * 100}%` : "0%",
                      height: "100%",
                      background: "var(--app-peach-500)",
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

async function loadEvents(): Promise<{
  rows: EventRow[];
  error: { message: string } | null;
}> {
  const since = new Date(
    Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data, error } = await getSupabaseAdmin()
    .from("survey_events")
    .select("session_id, survey_type, event, question_id, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(50000);

  return { rows: (data ?? []) as EventRow[], error };
}

export default async function ActivityPage() {
  const { rows, error } = await loadEvents();
  const days = dailyVisits(rows, CHART_DAYS);
  const busiest = Math.max(1, ...days.map((d) => d.visitors));

  const therapist = surveyFunnel(rows, therapistSurvey, "therapist");
  const patient = surveyFunnel(rows, patientSurvey, "patient");

  return (
    <div style={{ minHeight: "100vh", background: "var(--tm-bg-canvas)" }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(24px, 4vw, 40px) clamp(20px, 4vw, 40px)",
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
            fontFamily: "var(--tm-font-sans)",
            fontWeight: 600,
            fontSize: "clamp(24px, 3vw, 30px)",
            letterSpacing: "-0.015em",
            color: "var(--tm-text-primary)",
            margin: "0 0 6px",
          }}
        >
          Activity
        </h1>
        <p
          style={{
            fontFamily: "var(--tm-font-sans)",
            fontSize: 14.5,
            color: "var(--tm-text-tertiary)",
            margin: "0 0 28px",
            lineHeight: 1.5,
          }}
        >
          Anonymous visit counts for the last {LOOKBACK_DAYS} days. We never see
          who anyone is, and nothing anyone types is counted here — only which
          page or question was on screen. Days run in New York time.
        </p>

        {error ? (
          <p
            style={{
              color: "var(--tm-peach-700)",
              fontFamily: "var(--tm-font-sans)",
              padding: "24px 0",
            }}
          >
            Couldn&apos;t load activity: {error.message}
            {error.message.includes("survey_events") &&
              " — has supabase/schema.sql been re-run to create the survey_events table?"}
          </p>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 36,
              }}
            >
              <Tile
                label="Visitors"
                value={String(totalVisitors(rows))}
                hint={`last ${LOOKBACK_DAYS} days`}
              />
              <Tile
                label="Started"
                value={String(therapist.started + patient.started)}
                hint="both surveys"
              />
              <Tile
                label="Finished"
                value={String(therapist.completed + patient.completed)}
                hint="submitted answers"
              />
            </div>

            <div style={{ marginBottom: 36 }}>
              <SectionHeading
                title="Visitors per day"
                detail={`Distinct people per day for the last ${CHART_DAYS} days. Someone who visits twice in one day counts once.`}
              />
              <div
                style={{
                  padding: "18px 20px",
                  borderRadius: 16,
                  background: "var(--tm-bg-surface)",
                  boxShadow: "inset 0 0 0 1px var(--tm-border-default)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 9,
                }}
              >
                {days.map((d) => (
                  <div
                    key={d.day}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontFamily: "var(--tm-font-sans)",
                      fontSize: 13.5,
                    }}
                  >
                    <span
                      style={{
                        width: 110,
                        flexShrink: 0,
                        color: "var(--tm-text-tertiary)",
                      }}
                    >
                      {d.label}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 10,
                        background: "var(--tm-bg-muted)",
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(d.visitors / busiest) * 100}%`,
                          height: "100%",
                          background:
                            "linear-gradient(90deg, var(--app-plum), var(--app-peach-500))",
                          borderRadius: 999,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        width: 92,
                        flexShrink: 0,
                        textAlign: "right",
                        color: "var(--tm-text-primary)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {d.visitors}{" "}
                      <span style={{ color: "var(--tm-text-tertiary)" }}>
                        {d.visitors === 1 ? "person" : "people"}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <SectionHeading
              title="Started vs finished"
              detail="Someone counts as started once they open the first question, and finished once they press Submit."
            />
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <FunnelCard title="Therapist Survey" funnel={therapist} />
              <FunnelCard title="Patient Survey" funnel={patient} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
