import AdminReport from "@/components/admin/AdminReport";
import { patientSurvey } from "@/lib/surveys/patient";

export const dynamic = "force-dynamic";

export default function PatientReportPage() {
  return <AdminReport definition={patientSurvey} tableName="patient_responses" />;
}
