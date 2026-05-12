"use client";

import { Question } from "@/lib/types";

interface RadioQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export default function RadioQuestion({ question, value, onChange }: RadioQuestionProps) {
  return (
    <div className="space-y-3">
      {question.options?.map((option) => (
        <label
          key={option.value}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
            value === option.value
              ? "border-amber-500 bg-amber-500/10"
              : "border-foreground/10 hover:border-foreground/25"
          }`}
        >
          <input
            type="radio"
            name={question.id}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              value === option.value ? "border-amber-500" : "border-foreground/30"
            }`}
          >
            {value === option.value && (
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            )}
          </div>
          <span className="text-base">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
