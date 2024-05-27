import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function formatNumber(number: number): string {
  const suffixes = ["", "k", "M", "B", "T"];
  const absoluteValue = Math.abs(number);
  const decimalCount = Math.max(
    Math.abs(number).toString().split(".")[1]?.length || 0,
    0
  );
  const suffixIndex = Math.floor(Math.max(0, Math.log10(absoluteValue) / 3));
  const shortValue = parseFloat(
    (number / Math.pow(1000, suffixIndex)).toFixed(2)
  );
  const formattedValue = shortValue.toLocaleString(undefined, {
    maximumFractionDigits: decimalCount,
  });
  const suffix = suffixes[suffixIndex];
  return formattedValue + suffix;
}

export async function fetchDepartmentData(departmentId: string | string[]) {
  const { data: department, error: err1 } = await supabase
    .from("Department")
    .select(
      "*, department_user_worker(UserWorker(uid)), Client(uid), Task(uid)"
    )
    .eq("uid", departmentId)
    .single();
  if (err1) {
    console.log(err1);
    return;
  }
  return {
    uid: department.uid,
    title: department.title,
    description: department.description,
    created_at: department.created_at,
    info: [
      {
        name: "Workers",
        count: department.department_user_worker.length,
      },
      {
        name: "Clients",
        count: department.Client.length,
      },
      {
        name: "Tasks",
        count: department.Task.length,
      },
    ],
  };
}

export const fetchClientCurrency = async (department_id: string | string[]) => {
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
    .eq("department_id", department_id)
    
  if (error) {
    console.log("error currency", error);
    return;
  } else if (data && data.length > 0) {
    const currencyData = data as any[];
    return currencyData[0]?.currency;
  }
};
