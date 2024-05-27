import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getWorkers(department_id: string) {
  const { data: WorkerData } = await supabase
    .from("Department")
    .select("department_user_worker(UserWorker(*))")
    .eq("uid", department_id)
    .single();
  if (WorkerData) {
    const Workers = WorkerData.department_user_worker.map((worker) => {
      return {
        uid: worker.UserWorker?.uid ?? "",
        email: worker.UserWorker?.email ?? "",
        first_name: worker.UserWorker?.first_name ?? "",
        last_name: worker.UserWorker?.last_name ?? "",
        phone: worker.UserWorker?.phone ?? "",
        avatar: worker.UserWorker?.avatar ?? "",
        status: worker.UserWorker?.status ?? "",
        created_at: worker.UserWorker?.created_at ?? "",
        updated_at: worker.UserWorker?.updated_at ?? "",
        task_cost_id: worker.UserWorker?.task_cost_id ?? "",
        salary_hour: worker.UserWorker?.salary_hour ?? 0,
        salary_day: worker.UserWorker?.salary_day ?? 0,
        id: worker.UserWorker?.id ?? 0,
      };
    });
    return Workers;
  }

  return [];
}
