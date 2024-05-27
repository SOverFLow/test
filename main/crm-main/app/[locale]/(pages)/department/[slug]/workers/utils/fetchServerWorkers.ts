import { getDbOnSever } from "@/utils/supabase/cookie";
import { UserWorker } from "./types";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";

async function fetchServerWorkers(
  department_id: string
): Promise<UserWorker[] | undefined> {
  const supabase = await getDbOnSever();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }
  const query = await getTablePermissionForSpecificRows(
    user.role,
    "UserWorker",
    [
      "uid",
      "email",
      "first_name",
      "last_name",
      "phone",
      "salary_hour",
      "salary_day",
      "salary_month",
      "job_position",
      "avatar",
      "status",
      "created_at",
      "updated_at",
      "task_cost_id",
      "supervisor_id",
      "id",
    ]
  );
  const { data, error } = await supabase
    .from("Department")
    .select(`department_user_worker(UserWorker(${query}))`)
    .eq("uid", department_id)
    .limit(40)
    .single();
  if (error) {
    console.log("error: ", error);
    return;
  }

  // @ts-ignore
  const Workers = [];
  const data2 = data as any;
  const workerRelation = data2.department_user_worker as any;
  workerRelation.forEach(async (worker: any) => {
    Workers.push({
      uid: worker.UserWorker?.uid ?? "",
      email: worker.UserWorker?.email ?? "",
      first_name: worker.UserWorker?.first_name ?? "",
      last_name: worker.UserWorker?.last_name ?? "",
      phone: worker.UserWorker?.phone ?? "",
      salary_hour: worker.UserWorker?.salary_hour ?? 0,
      salary_day: worker.UserWorker?.salary_day ?? 0,
      salary_month: worker.UserWorker?.salary_month ?? 0,
      job_position: worker.UserWorker?.job_position ?? "No job position",
      salary_week: worker.UserWorker?.salary_day * 5 ?? 0,
      avatar: worker.UserWorker?.avatar ?? "/images/profile.png",
      status: worker.UserWorker?.status ?? "",
      created_at: worker.UserWorker?.created_at ?? "",
      updated_at: worker.UserWorker?.updated_at ?? "",
      task_cost_id: worker.UserWorker?.task_cost_id ?? "",
      supervisor:
        (await fetchSuperVisorName(
          department_id,
          worker.UserWorker?.supervisor_id
        )) ?? "No supervisor",
      id: worker.UserWorker?.id ?? 0,
    });
  });
  // @ts-ignore
  return Workers as UserWorker[];
}

export default fetchServerWorkers;

export const fetchCurrency = async (department_id: string | string[]) => {
  const supabase = await getDbOnSever();
  const userRole = (await supabase.auth.getUser()).data.user?.role;
  if (!userRole || !department_id) {
    return [];
  }
  const query = await getTablePermissionForSpecificRows(
    userRole,
    "DepartmentSettings",
    ["currency"]
  );
  const { data, error } = await supabase
    .from("DepartmentSettings")
    .select(query)
    .eq("department_id", department_id);

  if (error) {
    console.log("error currency", error);
    return;
  } else if (data && data.length > 0) {
    const currencyData = data as any[];
    return currencyData[0]?.currency;
  }
};

export const fetchSuperVisorName = async (
  department_id: string | string[],
  supervisor_id: string | null
) => {
  const supabase = await getDbOnSever();
  const userRole = (await supabase.auth.getUser()).data.user?.role;
  if (!userRole || !department_id) {
    return [];
  }
  const query = await getTablePermissionForSpecificRows(
    userRole,
    "UserWorker",
    ["first_name", "last_name"]
  );
  if (!supervisor_id) {
    return "No supervisor";
  }
  const { data, error } = await supabase
    .from("UserWorker")
    .select(query)
    .eq("uid", supervisor_id);

  if (error) {
    console.log("error supervisor", error);
    return;
  } else if (data && data.length > 0) {
    const supervisorData = data as any[];
    return `${supervisorData[0]?.first_name} ${supervisorData[0]?.last_name}`;
  }
};
