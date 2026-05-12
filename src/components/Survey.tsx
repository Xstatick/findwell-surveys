"use client";

import { useState, useEffect, useCallback } from "react";
import { SurveyDefinition, SurveyAnswers, Question, BranchRule } from "@/lib/types";
import { getSupabase } from "@/lib/supabase";
import { saveProgress, loadProgress, clearProgress } from "@/lib/storage";
import ProgressBar from "./ProgressBar";
import RadioQuestion from "./questions/RadioQuestion";
import TextQuestion from "./questions/TextQuestion";
import MultiSelectQuestion from "./questions/MultiSelectQuestion";
import { useRouter } from "next/navigation";

interface SurveyProps {
  definition: SurveyDefinition;
  surveyType: "therapist" | "patient";
  tableName: string;
}

function getQuestionPath(definition: SurveyDefinition, answers: SurveyAnswers): string[] {
  const path: string[] = [];
  let currentId: string | null = definition.firstQuestionId;

  while (currentId) {
    path.push(currentId);
    const question = definition.questions.find((q) => q.id === currentId);
    if (!question) break;

    const answer: string | string[] | undefined = answers[currentId];

    if (question.branchRules) {
      if (typeof answer === "string") {
        const matchedRule: BranchRule | undefined = question.branchRules.find((r) => r.optionValue === answer);
        currentId = matchedRule ? matchedRule.nextQuestionId : (question.nextQuestionId ?? null);
      } else {
        // No answer yet - follow the first branch to estimate remaining path length
        currentId = question.branchRules[0]?.nextQuestionId ?? (question.nextQuestionId ?? null);
      }
    } else {
      currentId = question.nextQuestionId ?? null;
    }
  }

  return path;
}

export default function Survey({ definition, surveyType, tableName }: SurveyProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [currentQuestionId, setCurrentQuestionId] = useState(definition.firstQuestionId);
  const [showIntro, setShowIntro] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = loadProgress(definition.id);
    if (saved) {
      setAnswers(saved.answers);
      if (saved.currentQuestionId) {
        setCurrentQuestionId(saved.currentQuestionId);
        setShowIntro(false);
      }
    }
    setLoaded(true);
  }, [definition.id]);

  useEffect(() => {
    if (loaded && !showIntro) {
      saveProgress(definition.id, answers, currentQuestionId);
    }
  }, [answers, currentQuestionId, definition.id, loaded, showIntro]);

  const questionPath = getQuestionPath(definition, answers);
  const currentIndex = questionPath.indexOf(currentQuestionId);
  const totalQuestions = questionPath.length;

  const currentQuestion = definition.questions.find((q) => q.id === currentQuestionId);

  const getNextQuestionId = useCallback((question: Question, currentAnswers: SurveyAnswers): string | null => {
    const answer = currentAnswers[question.id];
    if (question.branchRules && typeof answer === "string") {
      const matchedRule = question.branchRules.find((r) => r.optionValue === answer);
      if (matchedRule) return matchedRule.nextQuestionId;
    }
    return question.nextQuestionId ?? null;
  }, []);

  const handleNext = async () => {
    if (!currentQuestion) return;

    const nextId = getNextQuestionId(currentQuestion, answers);

    if (nextId === null) {
      setIsSubmitting(true);
      // Generate the row id client-side so we can update it from the thank-you
      // page without needing SELECT permission to look up the latest row
      const responseId = crypto.randomUUID();
      const { error } = await getSupabase().from(tableName).insert({
        id: responseId,
        responses: answers,
        submitted_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Submission error:", error);
        setIsSubmitting(false);
        return;
      }

      sessionStorage.setItem(`findwell-${surveyType}-response-id`, responseId);
      clearProgress(definition.id);
      router.push(`/thank-you?from=${surveyType}`);
      return;
    }

    setCurrentQuestionId(nextId);
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      if (definition.introText) {
        setShowIntro(true);
      }
      return;
    }
    setCurrentQuestionId(questionPath[currentIndex - 1]);
  };

  const currentAnswer = answers[currentQuestionId];
  const hasAnswer = Array.isArray(currentAnswer)
    ? currentAnswer.length > 0
    : !!currentAnswer;

  const isLastQuestion = (() => {
    if (!currentQuestion) return false;
    // If the question has branch rules but no answer yet, it's not the last question
    if (currentQuestion.branchRules && !hasAnswer) return false;
    return getNextQuestionId(currentQuestion, answers) === null;
  })();

  if (!loaded) {
    return <div className="min-h-screen flex items-center justify-center text-foreground/40">Loading...</div>;
  }

  if (showIntro && definition.introText) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <h1 className="text-3xl font-semibold mb-6">{definition.title}</h1>
          <p className="text-foreground/70 text-lg leading-relaxed mb-10">
            {definition.introText}
          </p>
          <button
            onClick={() => setShowIntro(false)}
            className="px-8 py-3 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors"
          >
            Get started
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="min-h-screen flex items-center justify-center text-foreground/40">Something went wrong.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <ProgressBar current={currentIndex + 1} total={totalQuestions} />

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">{currentQuestion.title}</h2>
          {currentQuestion.description && (
            <p className="text-foreground/60">{currentQuestion.description}</p>
          )}
        </div>

        <div className="mb-8">
          {currentQuestion.type === "radio" && (
            <RadioQuestion
              question={currentQuestion}
              value={(currentAnswer as string) ?? ""}
              onChange={(val) => setAnswers((prev) => ({ ...prev, [currentQuestionId]: val }))}
            />
          )}
          {currentQuestion.type === "text" && (
            <TextQuestion
              question={currentQuestion}
              value={(currentAnswer as string) ?? ""}
              onChange={(val) => setAnswers((prev) => ({ ...prev, [currentQuestionId]: val }))}
            />
          )}
          {currentQuestion.type === "multi-select" && (
            <MultiSelectQuestion
              question={currentQuestion}
              value={(currentAnswer as string[]) ?? []}
              onChange={(val) => setAnswers((prev) => ({ ...prev, [currentQuestionId]: val }))}
            />
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className="px-6 py-3 rounded-xl text-foreground/50 hover:text-foreground transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={(!hasAnswer && currentQuestion.required !== false) || isSubmitting}
            className="px-8 py-3 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : isLastQuestion ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
