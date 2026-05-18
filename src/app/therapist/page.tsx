"use client";

import Survey from "@/components/Survey";
import { SurveyDefinition } from "@/lib/types";

const therapistSurvey: SurveyDefinition = {
  id: "therapist",
  title: "Therapist Discovery Survey",
  description: "Help us understand your practice and what you look for in referral tools.",
  introText: "Thank you for taking a few minutes. We're researching the challenges therapists face when finding and connecting with the right clients, and your perspective will directly shape what we build. Your responses are completely anonymous, and you can skip anything you don't want to answer. At the end, you'll have the option to share your contact information if you'd like to be involved in future conversations. This should take less than 10 minutes.",
  firstQuestionId: "t1",
  questions: [
    {
      id: "t1",
      type: "text",
      title: "How would you describe your niche or specialty?",
      required: true,
      nextQuestionId: "t2",
    },
    {
      id: "t2",
      type: "text",
      title: "What are your best sources for new client referrals, and how reliable or consistent are those sources?",
      required: true,
      nextQuestionId: "t3",
    },
    {
      id: "t3",
      type: "text",
      title: "What referral sources have you tried with little success?",
      required: true,
      nextQuestionId: "t4",
    },
    {
      id: "t4",
      type: "radio",
      title: "Do you maintain a professional social media presence?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      required: true,
      branchRules: [
        { optionValue: "yes", nextQuestionId: "t4a" },
        { optionValue: "no", nextQuestionId: "t5" },
      ],
    },
    {
      id: "t4a",
      type: "text",
      title: "Which platforms do you use?",
      required: true,
      nextQuestionId: "t5",
    },
    {
      id: "t5",
      type: "text",
      title: "Are there specific presenting concerns, age groups, or treatment modalities you prefer not to work with?",
      description: "We ask this to better understand how therapists define a good fit - not to make any judgment about your practice.",
      required: true,
      nextQuestionId: "t6",
    },
    {
      id: "t6",
      type: "text",
      title: "How do you currently determine whether a prospective client is a good fit before your first session?",
      required: true,
      nextQuestionId: "t7",
    },
    {
      id: "t7",
      type: "radio",
      title: "How much time on average do you spend on intake and screening activities before taking on a new client?",
      options: [
        { label: "Less than 30 minutes", value: "less-than-30" },
        { label: "30 to 60 minutes", value: "30-to-60" },
        { label: "1 to 2 hours", value: "1-to-2-hours" },
        { label: "More than 2 hours", value: "more-than-2-hours" },
      ],
      required: true,
      nextQuestionId: "t8",
    },
    {
      id: "t8",
      type: "radio",
      title: "Of the prospective clients you meet with for an initial consultation, roughly what percentage do you continue working with?",
      options: [
        { label: "Less than 25%", value: "less-than-25" },
        { label: "25 to 50%", value: "25-to-50" },
        { label: "50 to 75%", value: "50-to-75" },
        { label: "More than 75%", value: "more-than-75" },
      ],
      required: true,
      nextQuestionId: "t8a",
    },
    {
      id: "t8a",
      type: "text",
      title: "What are the most common reasons a prospective client isn't a good fit?",
      required: true,
      nextQuestionId: "t9",
    },
    {
      id: "t9",
      type: "radio",
      title: "How many new clients would you ideally want to add to your practice?",
      options: [
        { label: "1 to 2", value: "1-to-2" },
        { label: "3 to 5", value: "3-to-5" },
        { label: "6 to 10", value: "6-to-10" },
        { label: "More than 10", value: "more-than-10" },
      ],
      required: true,
      nextQuestionId: "t9a",
    },
    {
      id: "t9a",
      type: "radio",
      title: "How close are you currently to your ideal caseload?",
      options: [
        { label: "I'm at capacity", value: "at-capacity" },
        { label: "I have some room", value: "some-room" },
        { label: "I have significant room", value: "significant-room" },
        { label: "I'm just starting to build my practice", value: "just-starting" },
      ],
      required: true,
      nextQuestionId: "t10",
    },
    {
      id: "t10",
      type: "multi-select",
      title: "What age range and/or generational groups represent the bulk of your clients?",
      options: [
        { label: "Gen Z", value: "gen-z" },
        { label: "Millennials", value: "millennials" },
        { label: "Gen X", value: "gen-x" },
        { label: "Boomers", value: "boomers" },
        { label: "Mixed", value: "mixed" },
      ],
      required: true,
      nextQuestionId: "t11",
    },
    {
      id: "t11",
      type: "text",
      title: "What would your ideal new client referral experience look like?",
      required: false,
      nextQuestionId: null,
    },
  ],
};

export default function TherapistSurveyPage() {
  return (
    <Survey
      definition={therapistSurvey}
      surveyType="therapist"
      tableName="therapist_responses"
    />
  );
}
