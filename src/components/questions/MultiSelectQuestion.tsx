"use client";

import { Question } from "@/lib/types";

interface MultiSelectQuestionProps {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
}

export default function MultiSelectQuestion({ question, value, onChange }: MultiSelectQuestionProps) {
  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-foreground/50 mb-1">Select all that apply</p>
      {question.options?.map((option) => {
        const isSelected = value.includes(option.value);
        return (
          <label
            key={option.value}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              isSelected
                ? "border-amber-500 bg-amber-500/10"
                : "border-foreground/10 hover:border-foreground/25"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleOption(option.value)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                isSelected ? "border-amber-500 bg-amber-500" : "border-foreground/30"
              }`}
            >
              {isSelected && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-base">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
