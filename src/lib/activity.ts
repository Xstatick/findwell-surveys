import { SurveyDefinition } from "@/lib/types";

// Days are bucketed in the team's timezone rather than UTC, so an evening visit
// doesn't show up on the following day in the report.
export const REPORT_TIMEZONE = "America/New_York";

export interface EventRow {
  session_id: string;
  survey_type: string | null;
  event: string;
  question_id: string | null;
  created_at: string;
}

export interface DayBucket {
  day: string;
  label: string;
  visitors: number;
  views: number;
}

export interface DropoffPoint {
  questionId: string;
  label: string;
  count: number;
}

export interface SurveyFunnel {
  surveyType: string;
  started: number;
  completed: number;
  unfinished: number;
  completionRate: number | null;
  dropoffs: DropoffPoint[];
}

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: REPORT_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const labelFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: REPORT_TIMEZONE,
  weekday: "short",
  month: "short",
  day: "numeric",
});

function dayKey(iso: string): string {
  return dayFormatter.format(new Date(iso));
}

// Visits per day for the last `days` days, most recent first. Days with no
// traffic are included as zeroes so a quiet stretch is visible rather than
// silently collapsed.
export function dailyVisits(rows: EventRow[], days = 14): DayBucket[] {
  const views = rows.filter((r) => r.event === "page_view");

  const byDay = new Map<string, { sessions: Set<string>; views: number }>();
  for (const row of views) {
    const key = dayKey(row.created_at);
    let bucket = byDay.get(key);
    if (!bucket) {
      bucket = { sessions: new Set(), views: 0 };
      byDay.set(key, bucket);
    }
    bucket.sessions.add(row.session_id);
    bucket.views += 1;
  }

  const out: DayBucket[] = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = dayFormatter.format(d);
    const bucket = byDay.get(key);
    out.push({
      day: key,
      label: labelFormatter.format(d),
      visitors: bucket ? bucket.sessions.size : 0,
      views: bucket ? bucket.views : 0,
    });
  }
  return out;
}

export function totalVisitors(rows: EventRow[]): number {
  return new Set(
    rows.filter((r) => r.event === "page_view").map((r) => r.session_id),
  ).size;
}

// Started vs finished for one survey, plus where the people who didn't finish
// stopped. "Stopped at" is the last question a session had on screen; sessions
// that completed are excluded.
export function surveyFunnel(
  rows: EventRow[],
  definition: SurveyDefinition,
  surveyType: string,
): SurveyFunnel {
  const mine = rows.filter((r) => r.survey_type === surveyType);

  const started = new Set(
    mine.filter((r) => r.event === "survey_start").map((r) => r.session_id),
  );
  const completed = new Set(
    mine.filter((r) => r.event === "survey_complete").map((r) => r.session_id),
  );

  // Last question seen per session.
  const lastQuestion = new Map<string, { questionId: string; at: number }>();
  for (const row of mine) {
    if (row.event !== "question_view" || !row.question_id) continue;
    const at = new Date(row.created_at).getTime();
    const current = lastQuestion.get(row.session_id);
    if (!current || at >= current.at) {
      lastQuestion.set(row.session_id, { questionId: row.question_id, at });
    }
  }

  // Anyone who viewed a question counts as started, even if the survey_start
  // event was lost (e.g. they resumed a saved session and skipped the intro).
  for (const sessionId of lastQuestion.keys()) started.add(sessionId);

  const titles = new Map(
    definition.questions.map((q) => [q.id, q.shortLabel ?? q.title]),
  );
  const order = new Map(definition.questions.map((q, i) => [q.id, i]));

  const counts = new Map<string, number>();
  for (const [sessionId, { questionId }] of lastQuestion) {
    if (completed.has(sessionId)) continue;
    counts.set(questionId, (counts.get(questionId) ?? 0) + 1);
  }

  const dropoffs = Array.from(counts.entries())
    .map(([questionId, count]) => ({
      questionId,
      label: titles.get(questionId) ?? questionId,
      count,
    }))
    .sort(
      (a, b) =>
        b.count - a.count ||
        (order.get(a.questionId) ?? 0) - (order.get(b.questionId) ?? 0),
    );

  return {
    surveyType,
    started: started.size,
    completed: completed.size,
    unfinished: Math.max(0, started.size - completed.size),
    completionRate: started.size
      ? Math.round((completed.size / started.size) * 100)
      : null,
    dropoffs,
  };
}
