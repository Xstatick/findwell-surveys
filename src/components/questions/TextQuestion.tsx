"use client";

import { Question } from "@/lib/types";

interface TextQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export default function TextQuestion({ question, value, onChange }: TextQuestionProps) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer here…"
        rows={6}
        className="fw-textarea"
        style={{
          background: "var(--tm-bg-surface)",
          borderRadius: 16,
          padding: "20px 22px",
          minHeight: 180,
          fontSize: 16.5,
          lineHeight: 1.6,
        }}
      />
      <div style={{
        marginTop: 8,
        fontFamily: "var(--tm-font-sans)", fontSize: 12.5,
        color: "var(--tm-text-tertiary)",
        display: "flex", justifyContent: "space-between",
      }}>
        <span>Write as much or as little as you want.</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{value.trim().length} characters</span>
      </div>
    </div>
  );
}
