"use client";

import { Question } from "@/lib/types";

interface MultiSelectQuestionProps {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
}

export default function MultiSelectQuestion({ question, value, onChange }: MultiSelectQuestionProps) {
  const toggle = (v: string) => {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };

  return (
    <div>
      <div style={{
        fontFamily: "var(--tm-font-sans)", fontSize: 13.5,
        color: "var(--tm-text-tertiary)", marginBottom: 12, fontWeight: 500,
      }}>
        Select all that apply
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {question.options?.map((option) => {
          const sel = value.includes(option.value);
          return (
            <label
              key={option.value}
              className="fw-choice-card"
              data-selected={sel ? "true" : "false"}
            >
              <input
                type="checkbox"
                checked={sel}
                onChange={() => toggle(option.value)}
                style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
              />
              <span style={{
                width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                background: sel ? "var(--app-peach-500)" : "transparent",
                border: "2px solid " + (sel ? "var(--app-peach-500)" : "var(--tm-paper-300)"),
                display: "grid", placeItems: "center",
                transition: "all 160ms",
              }}>
                {sel && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="#FDFBFA" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </span>
              <span style={{
                fontFamily: "var(--tm-font-sans)", fontSize: 16,
                color: "var(--tm-text-primary)", lineHeight: 1.4, fontWeight: 500,
              }}>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
