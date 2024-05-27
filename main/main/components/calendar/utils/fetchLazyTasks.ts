import { createClient } from "@/utils/supabase/client";
import { getMonthViewDateRange } from "@/utils/getMonthViewDateRange";
import { startOfWeek, endOfWeek } from "date-fns";

// task to Appointment

//fetch Client Tasks
async function fetchClientTasks(
  departmentId: string,
  startDate: string,
  endDate: string
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Task")
    .select("id, uid, title, start_date, end_date")
    .eq("department_id", departmentId)
    .or(
      `and(start_date.gte.${startDate},start_date.lte.${endDate}),and(end_date.gte.${startDate},end_date.lte.${endDate})`
    );
  if (error) {
    console.log("error", error);
    return [];
  }
  const appointment = data.map((task: any) => ({
    id: task.id,
    title: task.title,
    startDate: new Date(task.start_date),
    endDate: new Date(task.end_date),
  }));
  console.log("data", appointment.length);
  return appointment;
}
// fetch month tasks

async function fetchMonthTasks(departmentId: string, date: Date) {
  console.log("fetch month tasks...");
  const [startDate, endDate] = getMonthViewDateRange(date);
  return fetchClientTasks(departmentId, startDate, endDate);
}

//fetch week tasks

async function fetchWeekTasks(departmentId: string, date: Date) {
  const startDate = startOfWeek(date, { weekStartsOn: 1 })
    .toISOString()
    .split("T")[0];
  const endDate = endOfWeek(date, { weekStartsOn: 0 })
    .toISOString()
    .split("T")[0];
  console.log("start", startDate, "end", endDate);
  return fetchClientTasks(departmentId, startDate, endDate);
}

// fetch day tasks
async function fetchDayTasks(departmentId: string, date: Date) {
  const adjustedDate = date.toISOString().split("T")[0];
  console.log("adjustedDate", adjustedDate);
  return fetchClientTasks(departmentId, adjustedDate, adjustedDate);
}

//refetch tasks based on date and view

export { fetchMonthTasks, fetchWeekTasks, fetchDayTasks };
