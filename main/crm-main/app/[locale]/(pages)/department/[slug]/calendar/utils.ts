import { getMonthViewDateRange } from "@/utils/getMonthViewDateRange";
import { getDbOnSever } from "@/utils/supabase/cookie";

export default async function fetchServerTasks(departmentId: string) {
  const supabase = await getDbOnSever();

  const [startDate, endDate] = getMonthViewDateRange(new Date());
  const { data: userData } = await supabase.auth.getUser();
  if (userData.user?.role === "client") {
    const { data, error } = await supabase
      .from("Task")
      .select("id, uid, title, start_date, end_date, color")
      .eq("department_id", departmentId)
      .eq("client_id", userData.user?.id)
      .or(
        `and(start_date.gte.${startDate},start_date.lte.${endDate}),and(end_date.gte.${startDate},end_date.lte.${endDate})`
      );
    if (error) {
      console.log("error", error);
      return [];
    }
    const appointment = data.map((task: any) => ({
      id: task.uid,
      title: task.title,
      start: new Date(task.start_date),
      end: new Date(task.end_date),
      backgroundColor: task.color || "#5CAB7D",
    }));
    return appointment;
  }
  if (userData.user?.role === "worker") {
    let appointment: any = [];
    const { data: relations } = await supabase
      .from("task_user_worker")
      .select("task_id")
      .eq("user_worker_id", userData.user?.id);
    if (!relations) return [];
    await Promise.all(
      relations.map(async (relation: any) => {
        const { data, error } = await supabase
          .from("Task")
          .select("id, uid, title, start_date, end_date, color")
          .eq("department_id", departmentId)
          .eq("uid", relation.task_id)
          .or(
            `and(start_date.gte.${startDate},start_date.lte.${endDate}),and(end_date.gte.${startDate},end_date.lte.${endDate})`
          );
        if (error) {
          console.log("error: ", error);
        }
        data &&
          appointment.push({
            id: data[0].uid,
            title: data[0].title,
            start: new Date(data[0].start_date),
            end: new Date(data[0].end_date),
            backgroundColor: data[0].color || "#5CAB7D",
          });
      })
    );
    return appointment;
  }
  const { data, error } = await supabase
    .from("Task")
    .select("id, uid, title, start_date, end_date, color")
    .eq("department_id", departmentId)
    .or(
      `and(start_date.gte.${startDate},start_date.lte.${endDate}),and(end_date.gte.${startDate},end_date.lte.${endDate})`
    );
  if (error) {
    console.log("error", error);
    return [];
  }
  const appointment = data.map((task: any) => ({
    id: task.uid,
    title: task.title,
    start: new Date(task.start_date),
    end: new Date(task.end_date),
    backgroundColor: task.color || "#5CAB7D",
  }));
  return appointment;
}
