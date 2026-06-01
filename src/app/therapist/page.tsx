"use client";

import Survey from "@/components/Survey";
import { therapistSurvey } from "@/lib/surveys/therapist";

export default function TherapistSurveyPage() {
  return (
    <Survey
      definition={therapistSurvey}
      surveyType="therapist"
      tableName="therapist_responses"
    />
  );
}
