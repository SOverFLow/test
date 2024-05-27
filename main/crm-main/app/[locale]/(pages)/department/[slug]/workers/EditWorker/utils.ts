import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getWorkerData(worker_id: number | string) {
  const { data: WorkerData } = await supabase
    .from("UserWorker")
    .select("*")
    .eq("uid", worker_id)
    .single();
  if (WorkerData) {
    let supervisorData;
    if (WorkerData.supervisor_id) {
      const { data, error } = await supabase
        .from("UserWorker")
        .select("uid")
        .eq("uid", WorkerData.supervisor_id as string)
        .single();
      if (error) {
        console.log("error: ", error);
      }
      supervisorData = data;
    }
    return {
      email: WorkerData.email ?? "",
      first_name: WorkerData.first_name ?? "",
      last_name: WorkerData.last_name ?? "",
      phone: WorkerData.phone ?? "",
      salary_hour: WorkerData.salary_hour ?? 0.0,
      salary_day: WorkerData.salary_day ?? 0.0,
      salary_month: WorkerData.salary_month ?? 0.0,
      gender: WorkerData.gender ?? "",
      zip_code: WorkerData.zip_code ?? "",
      city: WorkerData.city ?? "",
      state_province: WorkerData.state_province ?? "",
      address: WorkerData.address ?? "",
      country: WorkerData.country ?? "",
      job_position: WorkerData.job_position ?? "",
      employment_date: WorkerData.employment_date ?? "",
      date_of_birth: WorkerData.date_of_birth ?? "",
      supervisor_id: supervisorData?.uid ?? null,
      security_number: WorkerData.security_number ?? "",
      licence_number: WorkerData.licence_number ?? "",
      notes: WorkerData.notes ?? "",
    };
  }
}
