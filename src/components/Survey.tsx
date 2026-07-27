"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  SurveyDefinition,
  SurveyAnswers,
  Question,
  BranchRule,
} from "@/lib/types";
import { getSupabase } from "@/lib/supabase";
import { saveProgress, loadProgress, clearProgress } from "@/lib/storage";
import { logEvent } from "@/lib/events";
import Link from "next/link";
import ProgressBar from "./ProgressBar";
import RadioQuestion from "./questions/RadioQuestion";
import TextQuestion from "./questions/TextQuestion";
import MultiSelectQuestion from "./questions/MultiSelectQuestion";
import BrandPanel from "./ui/BrandPanel";
import { IconChevronRight, IconChevronLeft, IconClock } from "./ui/Icons";
import { useRouter } from "next/navigation";

interface SurveyProps {
  definition: SurveyDefinition;
  surveyType: "therapist" | "patient";
  tableName: string;
}

function getQuestionPath(
  definition: SurveyDefinition,
  answers: SurveyAnswers,
): string[] {
  const path: string[] = [];
  let currentId: string | null = definition.firstQuestionId;

  while (currentId) {
    path.push(currentId);
    const question = definition.questions.find((q) => q.id === currentId);
    if (!question) break;

    const answer: string | string[] | undefined = answers[currentId];

    if (question.branchRules) {
      if (typeof answer === "string") {
        const matched: BranchRule | undefined = question.branchRules.find(
          (r: BranchRule) => r.optionValue === answer,
        );
        currentId = matched
          ? (matched.nextQuestionId ?? null)
          : (question.nextQuestionId ?? null);
      } else {
        // No answer yet - follow the first branch to estimate remaining path length
        currentId =
          question.branchRules[0]?.nextQuestionId ??
          question.nextQuestionId ??
          null;
      }
    } else {
      currentId = question.nextQuestionId ?? null;
    }
  }

  return path;
}

function PromiseRow({ label, detail }: { label: string; detail: string }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          flexShrink: 0,
          marginTop: 1,
          background: "var(--app-peach)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--app-plum)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <div>
        <div
          style={{
            fontFamily: "var(--tm-font-sans)",
            fontSize: 14.5,
            fontWeight: 600,
            color: "var(--tm-text-primary)",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: "var(--tm-font-sans)",
            fontSize: 13.5,
            color: "var(--tm-text-secondary)",
            lineHeight: 1.5,
          }}
        >
          {detail}
        </div>
      </div>
    </div>
  );
}

export default function Survey({
  definition,
  surveyType,
  tableName,
}: SurveyProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [currentQuestionId, setCurrentQuestionId] = useState(
    definition.firstQuestionId,
  );
  const [showIntro, setShowIntro] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
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

  // Record which question is on screen (the id only, never the answer) so the
  // admin Activity panel can show where people stop.
  useEffect(() => {
    if (loaded && !showIntro) {
      logEvent("question_view", { surveyType, questionId: currentQuestionId });
    }
  }, [currentQuestionId, loaded, showIntro, surveyType]);

  const questionPath = useMemo(
    () => getQuestionPath(definition, answers),
    [definition, answers],
  );
  const currentIndex = questionPath.indexOf(currentQuestionId);
  const totalQuestions = questionPath.length;
  const currentQuestion = definition.questions.find(
    (q) => q.id === currentQuestionId,
  );

  const getNextQuestionId = useCallback(
    (question: Question, currentAnswers: SurveyAnswers): string | null => {
      const answer = currentAnswers[question.id];
      if (question.branchRules && typeof answer === "string") {
        const matched = question.branchRules.find(
          (r: BranchRule) => r.optionValue === answer,
        );
        if (matched) return matched.nextQuestionId;
      }
      return question.nextQuestionId ?? null;
    },
    [],
  );

  const handleNext = async () => {
    if (!currentQuestion) return;
    const nextId = getNextQuestionId(currentQuestion, answers);

    if (nextId === null) {
      setIsSubmitting(true);
      setSubmitFailed(false);
      const responseId = crypto.randomUUID();

      // A paused Supabase project can either return an error or reject
      // outright, so catch both and surface the failure to the respondent
      // instead of leaving them on a dead button.
      let failed = false;
      try {
        const { error } = await getSupabase().from(tableName).insert({
          id: responseId,
          responses: answers,
          submitted_at: new Date().toISOString(),
        });
        if (error) {
          console.error("Submission error:", error);
          failed = true;
        }
      } catch (err) {
        console.error("Submission error:", err);
        failed = true;
      }

      if (failed) {
        // Progress stays in localStorage so a retry - now or later - still
        // has their answers.
        setIsSubmitting(false);
        setSubmitFailed(true);
        return;
      }

      logEvent("survey_complete", { surveyType });
      sessionStorage.setItem(`findwell-${surveyType}-response-id`, responseId);
      clearProgress(definition.id);
      router.push(`/thank-you?from=${surveyType}`);
      return;
    }

    setCurrentQuestionId(nextId);
  };

  const handleBack = () => {
    setSubmitFailed(false);
    if (currentIndex === 0) {
      if (definition.introText) setShowIntro(true);
      return;
    }
    setCurrentQuestionId(questionPath[currentIndex - 1]);
  };

  const currentAnswer = answers[currentQuestionId];
  const hasAnswer = Array.isArray(currentAnswer)
    ? currentAnswer.length > 0
    : !!currentAnswer;

  const canAdvance = (() => {
    if (!currentQuestion) return false;
    if (currentQuestion.type === "text") {
      return (
        typeof currentAnswer === "string" && currentAnswer.trim().length >= 3
      );
    }
    return hasAnswer;
  })();

  const isLastQuestion = (() => {
    if (!currentQuestion) return false;
    if (currentQuestion.branchRules && !hasAnswer) return false;
    return getNextQuestionId(currentQuestion, answers) === null;
  })();

  const isTherapist = surveyType === "therapist";

  if (!loaded) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--tm-text-tertiary)",
          fontFamily: "var(--tm-font-sans)",
        }}
      >
        Loading…
      </div>
    );
  }

  /* ── Intro screen ─────────────────────────────────────────────────────────── */
  if (showIntro && definition.introText) {
    return (
      <div className="qc-shell">
        <BrandPanel
          eyebrow={
            isTherapist
              ? "For licensed clinicians"
              : "For anyone who has thought about therapy"
          }
          headline={
            <>
              before
              <br />
              we begin.
            </>
          }
          support="Your responses are anonymous. A clinician on our team reads every response."
        />

        <main className="qc-content-pane">
          <div
            className="qc-content-inner"
            style={{ justifyContent: "center" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <Link
                href="/"
                style={{
                  alignSelf: "flex-start",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--tm-text-tertiary)",
                  fontFamily: "var(--tm-font-sans)",
                  fontSize: 13.5,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  textDecoration: "none",
                }}
              >
                <IconChevronLeft size={16} /> change perspective
              </Link>

              <h2
                style={{
                  fontFamily: "var(--tm-font-sans)",
                  fontWeight: 600,
                  fontSize: 32,
                  lineHeight: 1.2,
                  letterSpacing: "-0.015em",
                  color: "var(--tm-text-primary)",
                  margin: 0,
                }}
              >
                Here&apos;s what to expect.
              </h2>

              <p
                style={{
                  fontFamily: "var(--tm-font-sans)",
                  fontSize: 17,
                  lineHeight: 1.6,
                  color: "var(--tm-text-secondary)",
                  margin: 0,
                  maxWidth: 600,
                }}
              >
                {definition.introText}
              </p>

              <div
                style={{
                  marginTop: 12,
                  padding: "20px 22px",
                  background: "var(--tm-bg-subtle)",
                  borderRadius: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  maxWidth: 600,
                }}
              >
                <PromiseRow
                  label="Anonymous by default"
                  detail="We never link answers to you unless you opt in."
                />
                <PromiseRow
                  label="Shapes what we build"
                  detail={
                    isTherapist
                      ? "Your perspective directly informs the matching algorithm and the therapist experience."
                      : "A clinician reads every response. Your words land somewhere."
                  }
                />
              </div>

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <button
                  onClick={() => {
                    logEvent("survey_start", { surveyType });
                    setShowIntro(false);
                  }}
                  className="fw-btn"
                >
                  Get started <IconChevronRight size={18} />
                </button>
                <span
                  style={{
                    fontFamily: "var(--tm-font-sans)",
                    fontSize: 13.5,
                    color: "var(--tm-text-tertiary)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <IconClock size={14} /> Less than 10 minutes
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--tm-text-tertiary)",
          fontFamily: "var(--tm-font-sans)",
        }}
      >
        Something went wrong.
      </div>
    );
  }

  /* ── Question screen ──────────────────────────────────────────────────────── */
  const progressPct = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="qc-shell">
      <BrandPanel
        eyebrow={isTherapist ? "Therapist survey" : "Patient survey"}
        headline={
          <>
            your words,
            <br />
            <em style={{ fontStyle: "italic" }}>your pace</em>.
          </>
        }
        support="No right or wrong answers. We're here to listen."
      >
        {/* Progress chip in brand panel */}
        <div
          style={{
            marginTop: 8,
            padding: "14px 16px",
            background: "var(--tm-bg-surface)",
            borderRadius: 14,
            boxShadow: "inset 0 0 0 1px var(--tm-border-default)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            maxWidth: 360,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--tm-font-sans)",
              fontSize: 12.5,
              color: "var(--tm-text-tertiary)",
              fontWeight: 500,
            }}
          >
            <span>
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span style={{ color: "var(--tm-text-primary)", fontWeight: 600 }}>
              {progressPct}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: "var(--tm-bg-muted)",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progressPct}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg, var(--app-plum), var(--app-peach-500))",
                borderRadius: 999,
                transition: "width 380ms var(--tm-ease-standard)",
              }}
            />
          </div>
        </div>
      </BrandPanel>

      <main className="qc-content-pane">
        {/* Mobile progress bar */}
        <div className="qc-mobile-only">
          <ProgressBar current={currentIndex + 1} total={totalQuestions} />
        </div>

        <div className="qc-content-inner">
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            {/* Desktop back link */}
            <button
              onClick={handleBack}
              style={{
                alignSelf: "flex-start",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--tm-text-tertiary)",
                fontFamily: "var(--tm-font-sans)",
                fontSize: 13.5,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: 0,
              }}
            >
              <IconChevronLeft size={16} /> back
            </button>

            {/* Question header */}
            <div>
              <div
                style={{
                  fontFamily: "var(--tm-font-display)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: 22,
                  color: "var(--tm-text-tertiary)",
                  marginBottom: 14,
                }}
              >
                Question {currentIndex + 1}{" "}
                <span style={{ opacity: 0.55 }}>/ {totalQuestions}</span>
              </div>
              <h2
                style={{
                  fontFamily: "var(--tm-font-sans)",
                  fontWeight: 600,
                  fontSize: "clamp(24px, 3vw, 36px)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.015em",
                  color: "var(--tm-text-primary)",
                  margin: 0,
                }}
              >
                {currentQuestion.title}
              </h2>
              {currentQuestion.description && (
                <p
                  style={{
                    fontFamily: "var(--tm-font-sans)",
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: "var(--tm-text-secondary)",
                    margin: "12px 0 0",
                    maxWidth: 600,
                  }}
                >
                  {currentQuestion.description}
                </p>
              )}
            </div>

            {/* Answer */}
            <div style={{ marginTop: 4 }}>
              {currentQuestion.type === "radio" && (
                <RadioQuestion
                  question={currentQuestion}
                  value={(currentAnswer as string) ?? ""}
                  onChange={(val) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [currentQuestionId]: val,
                    }))
                  }
                />
              )}
              {currentQuestion.type === "text" && (
                <TextQuestion
                  question={currentQuestion}
                  value={(currentAnswer as string) ?? ""}
                  onChange={(val) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [currentQuestionId]: val,
                    }))
                  }
                />
              )}
              {currentQuestion.type === "multi-select" && (
                <MultiSelectQuestion
                  question={currentQuestion}
                  value={(currentAnswer as string[]) ?? []}
                  onChange={(val) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [currentQuestionId]: val,
                    }))
                  }
                />
              )}
            </div>

            {/* Submission failure - e.g. the database is paused or the
                respondent dropped offline. Their answers are still saved
                locally, so a retry is genuinely worth offering. */}
            {submitFailed && (
              <div
                role="alert"
                style={{
                  marginTop: 8,
                  padding: "18px 20px",
                  borderRadius: 14,
                  background: "var(--tm-peach-50)",
                  boxShadow: "inset 0 0 0 1.5px var(--tm-peach-300)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  maxWidth: 600,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--tm-font-sans)",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--tm-text-primary)",
                  }}
                >
                  We couldn&apos;t save your answers just now.
                </div>
                <div
                  style={{
                    fontFamily: "var(--tm-font-sans)",
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "var(--tm-text-secondary)",
                  }}
                >
                  Nothing is lost — your answers are still saved on this device.
                  Press &ldquo;Try again&rdquo; below. If it keeps failing, come
                  back to this page later and your answers will be waiting.
                </div>
              </div>
            )}

            {/* Bottom action row */}
            <div
              style={{
                marginTop: 16,
                paddingTop: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                borderTop: "1px solid var(--tm-border-subtle)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--tm-font-sans)",
                  fontSize: 13.5,
                  color: "var(--tm-text-tertiary)",
                }}
              >
                {currentQuestion.type === "multi-select"
                  ? "Select all that apply."
                  : currentQuestion.type === "radio"
                    ? "Choose one."
                    : ""}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={handleBack} className="fw-btn fw-btn--ghost">
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canAdvance || isSubmitting}
                  className="fw-btn"
                >
                  {isSubmitting
                    ? "Submitting…"
                    : submitFailed
                      ? "Try again"
                      : isLastQuestion
                        ? "Submit"
                        : "Next"}
                  {!isSubmitting && <IconChevronRight size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
