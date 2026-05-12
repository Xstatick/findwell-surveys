export type QuestionType = "radio" | "text" | "multi-select";

export interface QuestionOption {
  label: string;
  value: string;
}

export interface BranchRule {
  optionValue: string;
  nextQuestionId: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  options?: QuestionOption[];
  required?: boolean;
  // If present, the answer to this question determines which question comes next
  branchRules?: BranchRule[];
  // Default next question if no branch rule matches (or if no branching)
  nextQuestionId?: string | null;
}

export interface SurveyDefinition {
  id: string;
  title: string;
  description: string;
  introText?: string;
  questions: Question[];
  firstQuestionId: string;
}

export type SurveyAnswers = Record<string, string | string[]>;

export interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  interests?: string[];
}

export interface SurveySubmission {
  survey_type: "therapist" | "patient";
  responses: SurveyAnswers;
  submitted_at: string;
  contact_optin: ContactInfo | null;
}
