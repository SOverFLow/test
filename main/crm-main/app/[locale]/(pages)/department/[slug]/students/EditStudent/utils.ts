import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getStudentData(student_id: number | string) {
  const { data: StudentData, error: error } = await supabase
    .from("Student")
    .select("*")
    .eq("uid", student_id)
    .single();
  if (StudentData) {
    return {
      email: StudentData.email ?? "",
      first_name: StudentData.first_name ?? "",
      last_name: StudentData.last_name ?? "",
      phone: StudentData.phone ?? "",
      level: StudentData.level ?? "",
      budget: StudentData.budget ?? "",
      address: StudentData.address ?? "",
      payment_method: StudentData.payment_method ?? "",
      notes: StudentData.notes ?? "",
      social_security_number: StudentData.social_security_number ?? "",
    };
  }
}
