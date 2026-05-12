import { SurveyAnswers } from "./types";

function storageKey(surveyId: string): string {
  return `findwell-survey-${surveyId}`;
}

function currentQuestionKey(surveyId: string): string {
  return `findwell-survey-${surveyId}-current`;
}

export function saveProgress(surveyId: string, answers: SurveyAnswers, currentQuestionId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(surveyId), JSON.stringify(answers));
  localStorage.setItem(currentQuestionKey(surveyId), currentQuestionId);
}

export function loadProgress(surveyId: string): { answers: SurveyAnswers; currentQuestionId: string | null } | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(storageKey(surveyId));
  if (!saved) return null;
  try {
    const answers = JSON.parse(saved) as SurveyAnswers;
    const currentQuestionId = localStorage.getItem(currentQuestionKey(surveyId));
    return { answers, currentQuestionId };
  } catch {
    return null;
  }
}

export function clearProgress(surveyId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey(surveyId));
  localStorage.removeItem(currentQuestionKey(surveyId));
}
