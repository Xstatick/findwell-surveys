"use client";

import { useState } from "react";
import { ResponseRow } from "@/lib/types";
import { SurveyColumn, formatAnswer } from "@/lib/surveys/columns";

interface ResponsesTableProps {
  surveyId: string;
  columns: SurveyColumn[];
  rows: ResponseRow[];
}

const TRUNCATE = 80;

const CONTACT_FIELDS: { key: keyof NonNullable<ResponseRow["contact_optin"]>; header: string }[] = [
  { key: "name", header: "Contact name" },
  { key: "email", header: "Contact email" },
  { key: "phone", header: "Contact phone" },
  { key: "interests", header: "Contact interests" },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function contactValue(row: ResponseRow, key: string): string {
  const c = row.contact_optin;
  if (!c) return "";
  const v = (c as Record<string, unknown>)[key];
  if (Array.isArray(v)) return v.join(", ");
  return v == null ? "" : String(v);
}

// Build the full (untruncated) value matrix used for both rendering and CSV.
function cellValues(row: ResponseRow, columns: SurveyColumn[]): string[] {
  const answers = columns.map((col) => formatAnswer(row.responses?.[col.id], col));
  const contact = CONTACT_FIELDS.map((f) => contactValue(row, f.key));
  return [formatDate(row.submitted_at), ...answers, ...contact];
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadCsv(surveyId: string, headers: string[], rows: ResponseRow[], columns: SurveyColumn[]) {
  const lines = [headers.map(csvEscape).join(",")];
  for (const row of rows) {
    lines.push(cellValues(row, columns).map(csvEscape).join(","));
  }
  const blob = new Blob([lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `findwell-${surveyId}-responses.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function Cell({ value }: { value: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = value.length > TRUNCATE;
  const display = expanded || !isLong ? value : `${value.slice(0, TRUNCATE)}…`;
  return (
    <td
      title={isLong ? value : undefined}
      onClick={isLong ? () => setExpanded((e) => !e) : undefined}
      style={{
        verticalAlign: "top",
        borderBottom: "1px solid var(--tm-border-subtle)",
        padding: "10px 14px",
        fontFamily: "var(--tm-font-sans)",
        fontSize: 13.5,
        color: "var(--tm-text-secondary)",
        cursor: isLong ? "pointer" : "default",
        maxWidth: 320,
      }}
    >
      <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{display || " "}</span>
    </td>
  );
}

export default function ResponsesTable({ surveyId, columns, rows }: ResponsesTableProps) {
  const headers = ["Submitted", ...columns.map((c) => c.header), ...CONTACT_FIELDS.map((f) => f.header)];
  const headerTitles = ["Submitted", ...columns.map((c) => c.title), ...CONTACT_FIELDS.map((f) => f.header)];

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <p style={{ fontFamily: "var(--tm-font-sans)", fontSize: 13.5, color: "var(--tm-text-tertiary)", margin: 0 }}>
          {rows.length} response{rows.length === 1 ? "" : "s"}
        </p>
        <button
          className="fw-btn fw-btn--sm"
          onClick={() => downloadCsv(surveyId, headers, rows, columns)}
          disabled={rows.length === 0}
        >
          Export CSV
        </button>
      </div>

      {rows.length === 0 ? (
        <p
          style={{
            fontFamily: "var(--tm-font-sans)",
            color: "var(--tm-text-tertiary)",
            textAlign: "center",
            padding: "48px 0",
          }}
        >
          No responses yet.
        </p>
      ) : (
        <div
          style={{
            overflowX: "auto",
            border: "1px solid var(--tm-border-default)",
            borderRadius: "var(--tm-radius-lg)",
            background: "var(--tm-bg-surface)",
          }}
        >
          <table style={{ borderCollapse: "collapse", minWidth: "100%" }}>
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    title={headerTitles[i]}
                    style={{
                      position: "sticky",
                      top: 0,
                      background: "var(--tm-bg-subtle)",
                      textAlign: "left",
                      fontFamily: "var(--tm-font-sans)",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "var(--tm-text-tertiary)",
                      padding: "10px 14px",
                      borderBottom: "1px solid var(--tm-border-default)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const values = cellValues(row, columns);
                return (
                  <tr key={row.id}>
                    {values.map((v, i) => (
                      <Cell key={i} value={v} />
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
