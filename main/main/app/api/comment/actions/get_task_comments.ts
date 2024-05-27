"use server";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";
import { send } from "process";

const getTaskComments = async (task_id: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();
  const userRole = user.data.user?.role;
  if (!userRole) {
    return { error: "An error occurred while fetching banks data" };
  }

  const query = await getTablePermissionForSpecificRows(userRole, "Comment", [
    "uid",
    "id",
    "created_at",
    "task_id",
    "sender_id",
    "sender_img",
    "sender_name",
    "content",
  ]);

  const { error, data } = await supabase
    .from("Comment")
    .select(query)
    .eq("task_id", task_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("error", error);
    console.error(error);
    return { error: error.message };
  } else {
    return { data };
  }
};

export default getTaskComments;
