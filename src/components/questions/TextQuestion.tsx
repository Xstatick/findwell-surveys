"use client";

import { Question } from "@/lib/types";

interface TextQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export default function TextQuestion({ question, value, onChange }: TextQuestionProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your answer here..."
      rows={4}
      className="w-full p-4 rounded-xl border-2 border-foreground/10 bg-transparent text-foreground placeholder:text-foreground/30 focus:border-amber-500 focus:outline-none resize-none transition-colors"
    />
  );
}
