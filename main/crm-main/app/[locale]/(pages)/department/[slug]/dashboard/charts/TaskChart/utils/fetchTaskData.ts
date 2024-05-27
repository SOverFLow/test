import { createClient } from "@/utils/supabase/client";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";

function stringToDate(str: string) {
  if (str.length !== 8 || isNaN(Number(str))) {
    throw new Error("Invalid date format. Please use YYYYMMDD.");
  }

  var year = parseInt(str.substring(0, 4), 10);
  var month = parseInt(str.substring(4, 6), 10) - 1;
  var day = parseInt(str.substring(6, 8), 10);

  return new Date(year, month, day);
}

export async function fetchTaskData(
  department_id: string,
  start_date: string,
  end_date: string
) {
  const supabase = createClient();
  const userRole = (await supabase.auth.getUser()).data.user?.role;
  if (!userRole || !department_id || !start_date || !end_date) {
    return [];
  }
  const newStartDate = stringToDate(start_date);
  const newEndDate = stringToDate(end_date);
  const query = await getTablePermissionForSpecificRows(userRole, "Task", [
    "status", "start_date",
  ]);
  const { data, error } = await supabase
    .from("Task")
    .select(query)
    .eq("department_id", department_id)
    .gte(
      "start_date",
      `${newStartDate.getFullYear()}-${
        newStartDate.getMonth() + 1
      }-${newStartDate.getDate()}T00:00:00.000Z`
    )
    .lte(
      "start_date",
      `${newEndDate.getFullYear()}-${
        newEndDate.getMonth() + 1
      }-${newEndDate.getDate()}T23:59:59.999Z`
    );
  if (error) {
    console.log("error2: ", error);
    return;
  }

  if (data) {
    const counts = data.reduce(
      (acc: any, task: any) => {
        if (task.status === "done") acc.done++;
        else if (task.status === "in_progress") acc.inProgress++;
        else if (task.status === "pending") acc.pending++;
        return acc;
      },
      { done: 0, inProgress: 0, pending: 0 }
    );
    return counts;
  }
}
