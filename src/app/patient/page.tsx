"use client";

import Survey from "@/components/Survey";
import { SurveyDefinition } from "@/lib/types";

const patientSurvey: SurveyDefinition = {
  id: "patient",
  title: "Patient Discovery Survey",
  description: "Help us understand what matters most when you look for a therapist.",
  introText: "Your responses are completely anonymous. I'm researching how people experience finding mental health support, and I'd love your honest take. There are no right or wrong answers, and you can skip anything you don't want to answer. At the end, you'll have the option to share your contact information if you'd like to stay involved. This should take about 10 minutes.",
  firstQuestionId: "p1",
  questions: [
    // Section 1: For Everyone
    {
      id: "p1",
      type: "radio",
      title: "Have you ever considered trying therapy or counseling?",
      required: true,
      options: [
        { label: "Yes, and I have tried it", value: "tried" },
        { label: "Yes, but I've never tried it", value: "considered" },
        { label: "No, I haven't really considered it", value: "not-considered" },
      ],
      branchRules: [
        { optionValue: "tried", nextQuestionId: "p2" },
        { optionValue: "considered", nextQuestionId: "p10" },
        { optionValue: "not-considered", nextQuestionId: "p14" },
      ],
    },

    // Section 2: For People Who Have Tried Therapy
    {
      id: "p2",
      type: "radio",
      title: "Roughly how long ago was your most recent search for a therapist?",
      options: [
        { label: "Within the last year", value: "last-year" },
        { label: "1 to 3 years ago", value: "1-to-3" },
        { label: "3 to 10 years ago", value: "3-to-10" },
        { label: "More than 10 years ago", value: "more-than-10" },
      ],
      required: false,
      nextQuestionId: "p3",
    },
    {
      id: "p3",
      type: "text",
      title: "The most recent time you tried to find a therapist, where did you start looking?",
      required: false,
      nextQuestionId: "p4",
    },
    {
      id: "p4",
      type: "text",
      title: "After that initial start, walk me through what came next.",
      description: "We're curious about the whole experience - who you contacted, who you talked to, what worked, what didn't.",
      required: false,
      nextQuestionId: "p5",
    },
    {
      id: "p5",
      type: "radio",
      title: "Roughly how many therapists did you reach out to before you found one you stuck with?",
      description: "Counts every therapist you contacted, even ones who never responded or who you didn't end up meeting.",
      options: [
        { label: "1", value: "1" },
        { label: "2 to 3", value: "2-to-3" },
        { label: "4 to 6", value: "4-to-6" },
        { label: "More than 6", value: "more-than-6" },
        { label: "I never found one I stuck with", value: "never-found" },
      ],
      required: false,
      nextQuestionId: "p6",
    },
    {
      id: "p6",
      type: "radio",
      title: "Of the therapists you actually met with, how many did you cycle through before finding one who felt right?",
      options: [
        { label: "1 - the first one was a good fit", value: "1" },
        { label: "2 to 3", value: "2-to-3" },
        { label: "4 or more", value: "4-or-more" },
        { label: "I never found one who felt right", value: "never-found" },
      ],
      required: false,
      nextQuestionId: "p7",
    },
    {
      id: "p7",
      type: "text",
      title: "If you tried therapists who didn't feel like a good fit, what made it not work?",
      required: false,
      nextQuestionId: "p8",
    },
    {
      id: "p8",
      type: "radio",
      title: "Was there ever a point where you considered giving up on finding a therapist altogether?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I did give up, at least for a while", value: "gave-up" },
      ],
      required: false,
      branchRules: [
        { optionValue: "yes", nextQuestionId: "p8a" },
        { optionValue: "no", nextQuestionId: "p9" },
        { optionValue: "gave-up", nextQuestionId: "p8a" },
      ],
    },
    {
      id: "p8a",
      type: "text",
      title: "What was happening at that point?",
      required: false,
      nextQuestionId: "p9",
    },
    {
      id: "p9",
      type: "text",
      title: "What, if anything, would have made finding the right therapist easier the first time?",
      required: false,
      nextQuestionId: null,
    },

    // Section 3: For People Who Considered Therapy but Never Tried
    {
      id: "p10",
      type: "text",
      title: "What drew you to consider therapy in the first place?",
      required: false,
      nextQuestionId: "p11",
    },
    {
      id: "p11",
      type: "text",
      title: "What stopped you from trying?",
      required: false,
      nextQuestionId: "p12",
    },
    {
      id: "p12",
      type: "text",
      title: "If you imagined trying to find a therapist tomorrow, where would you start?",
      required: false,
      nextQuestionId: "p13",
    },
    {
      id: "p13",
      type: "text",
      title: "What would have to be true for you to take that first step?",
      required: false,
      nextQuestionId: null,
    },

    // Section 4: For People Who Haven't Considered Therapy
    {
      id: "p14",
      type: "text",
      title: "If a close friend told you they were thinking about trying therapy, what advice would you give them about how to find one?",
      required: false,
      nextQuestionId: "p15",
    },
    {
      id: "p15",
      type: "text",
      title: "Is there anything that has shaped your view of therapy - positive or negative?",
      required: false,
      nextQuestionId: null,
    },
  ],
};

export default function PatientSurveyPage() {
  return (
    <Survey
      definition={patientSurvey}
      surveyType="patient"
      tableName="patient_responses"
    />
  );
}
