import AdminReport from "@/components/admin/AdminReport";
import { therapistSurvey } from "@/lib/surveys/therapist";

export const dynamic = "force-dynamic";

export default function TherapistReportPage() {
  return <AdminReport definition={therapistSurvey} tableName="therapist_responses" />;
}
