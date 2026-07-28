import { getSupabase } from "./supabase";

// Anonymous usage events, used only to answer "is anyone showing up, and how
// far do they get". See supabase/schema.sql for the storage shape.
//
// Two rules this module must never break:
//   1. Nothing a respondent types is recorded here - only which question was
//      on screen. Answers reach the database only when they press Submit.
//   2. Logging is best-effort. A failure here must never interrupt, block, or
//      break a survey, so every call is fire-and-forget and swallows errors.

export type SurveyEventName =
  | "page_view"
  | "survey_start"
  | "question_view"
  | "survey_complete";

const SESSION_KEY = "findwell-session-id";

// A random id per browser session. Not derived from anything about the person;
// it exists so we can tell "one person answered 8 questions" apart from "eight
// people answered one question each".
function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    // Private mode or storage disabled - skip logging rather than fail.
    return null;
  }
}

// Admin traffic is our own and would drown out the numbers we care about.
function isAdminPath(path: string): boolean {
  return path === "/admin" || path.startsWith("/admin/");
}

export function logEvent(
  event: SurveyEventName,
  details: {
    surveyType?: string;
    questionId?: string;
    path?: string;
  } = {},
): void {
  if (typeof window === "undefined") return;

  const path = details.path ?? window.location.pathname;
  if (isAdminPath(path)) return;

  const sessionId = getSessionId();
  if (!sessionId) return;

  try {
    void getSupabase()
      .from("survey_events")
      .insert({
        session_id: sessionId,
        survey_type: details.surveyType ?? null,
        event,
        question_id: details.questionId ?? null,
        path,
      })
      .then(({ error }) => {
        if (error) console.debug("Event logging skipped:", error.message);
      });
  } catch {
    // Missing config, offline, blocked request - all non-fatal by design.
  }
}
