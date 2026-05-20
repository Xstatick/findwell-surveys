"use client";

import { Question } from "@/lib/types";

interface RadioQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export default function RadioQuestion({ question, value, onChange }: RadioQuestionProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {question.options?.map((option) => {
        const sel = value === option.value;
        return (
          <label
            key={option.value}
            className="fw-choice-card"
            data-selected={sel ? "true" : "false"}
          >
            <input
              type="radio"
              name={question.id}
              value={option.value}
              checked={sel}
              onChange={(e) => onChange(e.target.value)}
              style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
            />
            <span style={{
              width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
              border: "2px solid " + (sel ? "var(--app-peach-500)" : "var(--tm-paper-300)"),
              display: "grid", placeItems: "center",
              transition: "border-color 160ms",
            }}>
              {sel && (
                <span style={{
                  width: 11, height: 11, borderRadius: "50%",
                  background: "var(--app-peach-500)",
                }} />
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
  );
}
