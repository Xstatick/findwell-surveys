"use client";

import Survey from "@/components/Survey";
import { patientSurvey } from "@/lib/surveys/patient";

export default function PatientSurveyPage() {
  return (
    <Survey
      definition={patientSurvey}
      surveyType="patient"
      tableName="patient_responses"
    />
  );
}
