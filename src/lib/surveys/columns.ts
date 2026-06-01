import { SurveyDefinition, QuestionType } from "@/lib/types";

export interface SurveyColumn {
  id: string;
  header: string;
  title: string;
  type: QuestionType;
  valueToLabel: Record<string, string>;
}

// Derive ordered, grid-friendly columns from a survey definition. Questions are
// kept in definition order (which matches the survey flow, branches inlined).
export function getColumns(def: SurveyDefinition): SurveyColumn[] {
  return def.questions.map((q) => ({
    id: q.id,
    header: q.shortLabel ?? q.title,
    title: q.title,
    type: q.type,
    valueToLabel: Object.fromEntries((q.options ?? []).map((o) => [o.value, o.label])),
  }));
}

// Render a stored answer (option value(s) for radio/multi-select, raw string for
// text) into a human-readable string. Returns "" for missing answers.
export function formatAnswer(value: string | string[] | undefined, column: SurveyColumn): string {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) {
    return value.map((v) => column.valueToLabel[v] ?? v).join(", ");
  }
  return column.valueToLabel[value] ?? value;
}
