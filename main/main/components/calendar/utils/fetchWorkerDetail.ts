"use server";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { getDbOnSever } from "@/utils/supabase/cookie";

const fetchPopUpDetail = async (taskId: string) => {
  const supabase = await getDbOnSever();
  let returnData = {
    worker_name: "",
    client_name: "",
    address: "",
    uid: "",
    title: "",
  };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }
  const query = await getTablePermissionForSpecificRows(user.role, "Task", [
    "uid",
    "priority",
    "title",
    "start_date",
    "end_date",
    "address",
    "depend_on_id",
  ]);

  const queryClient = await getTablePermissionForSpecificRows(
    user.role,
    "Client",
    ["first_name", "last_name"]
  );
  const queryWorker = await getTablePermissionForSpecificRows(
    user.role,
    "UserWorker",
    ["first_name", "last_name"]
  );
//   "uid,priority,title,start_date,end_date,Client(first_name,last_name),address,task_user_worker(UserWorker(first_name,last_name)),depend_on_id"
  const { data:dra, error } = await supabase
    .from("Task")
    .select(
      `${query},Client(${queryClient}),task_user_worker(UserWorker(${queryWorker}))`
    )
    .eq("uid", taskId);
  if (error || !dra) {
    console.log("error", error);
    return "";
  }
  const data = dra as any;
  if (data[0].Client)
    returnData.client_name = `${data[0].Client.first_name ?? ""} ${data[0].Client.last_name ?? ""}`;
  if (data[0].task_user_worker[0] && data[0].task_user_worker[0].UserWorker)
    returnData.worker_name = `${data[0].task_user_worker[0].UserWorker.first_name ?? ""} ${data[0].task_user_worker[0].UserWorker.last_name ?? ""}`;

  return {
    worker_name: returnData.worker_name,
    client_name: returnData.client_name,
    address: data[0].address ?? '',
    depend_on_id: data[0].depend_on_id ?? '',
    uid: data[0].uid ?? '',
    title: data[0].title ?? '',
    start_date: data[0].start_date ?? '',
    end_date: data[0].end_date ?? '',
    priority: data[0].priority ?? '',
  };
};

export default fetchPopUpDetail;
