import { Database } from "@/types/supabase";
import { Task } from "./types";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import getTablePermissions from "@/utils/fetchingWithRole/getTablePermissions";

export interface PayloadTask {
  id: number;
  uid: string;
  title: string;
  description: string;
  cost: number;
  lattitude: number;
  long: number;
  address: string;
  priority: string | null;
  start_date: string;
  end_date: string;
  client_id: any;
  column_id: string | null;
  created_at: string;
  updated_at: string;
  images: string[] | null;
  status: string;
}

export async function payloadToTask(
  task: any,
  supabase: SupabaseClient<Database>,
  userRole: string
): Promise<Task | null> {
  const query = await getTablePermissions(userRole, "Task", "uid", [
    {
      tableName: "task_user_worker",
      rows: [
        {
          tableName: "UserWorker",
          rows: ["uid", "first_name", "last_name", "avatar"],
        },
      ],
    },
    {
      tableName: "Client",
      rows: ["uid", "first_name", "last_name"],
    },
  ]);
  console.log("query: ", query);
  const { data, error }: any = await supabase
    .from("Task")
    .select(query)
    .eq("uid", task.uid);
  // console.log("data: ", data);
  if (error) {
    console.log("error: ", error);
    return null;
  }
  return {
    uid: task.uid,
    title: task.title,
    cost: task.cost,
    address: task.address,
    priority: task.priority,
    column_id: task.column_id,
    start_date: task.start_date,
    end_date: task.end_date,
    Workers: data[0].task_user_worker
      ? data[0].task_user_worker.map((worker: any) => worker.UserWorker)
      : [],
    Client: data[0].Client,
    status: task.status,
    confirmed: task.confirmed,
  };
}
