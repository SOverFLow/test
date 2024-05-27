import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getTaskData(taskId: number | string) {
  let { data, error } = await supabase
    .from("Task")
    .select("*")
    .eq("uid", taskId)
    .single();

  if (data && !error) {
    // get the denpendency title of the task by the dependency_id
    const { data: dependencyData, error: dependencyError } = await supabase
      .from("Task")
      .select("title")
      .eq("uid", data.depend_on_id!)
      .single();
    if (dependencyData && !dependencyError) {
      return {
        dependecyTitle: dependencyData.title,
        ...data,
      };
    }
    return data;
  }
  if (error) throw error;
  return data;
}
