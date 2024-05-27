import getTablePermissions from "@/utils/fetchingWithRole/getTablePermissions";
import { createClient } from "@/utils/supabase/client";

async function fetchClientTasks(
  department_id: string,
  date: Date,
  userRole: string
) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const query = await getTablePermissions(
    userRole,
    "Task",
    "uid, title, status, start_date, end_date",
    [
      {
        tableName: "task_user_worker",
        rows: [
          {
            tableName: "UserWorker",
            rows: ["uid", "first_name", "last_name", "avatar"],
          },
        ],
      },
    ]
  );

  if (userRole === "client") {
    const { data, error } = await supabase
      .from("Task")
      .select(query)
      .eq("department_id", department_id)
      .eq("client_id", userData.user?.id ?? "")
      .lte(
        "start_date",
        `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}T23:59:59.999Z`
      )
      .gte(
        "start_date",
        `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}T00:00:00.000Z`
      );
    if (error) {
      console.log("error2: ", error);
      return;
    }
    const tasks = data
      .map((task: any) => {
        return {
          id: task.uid,
          title: task.title,
          startTime: task.start_date,
          endTime: task.end_date,
          status: task.status,
          avatarUrl: task.task_user_worker?.map(
            (worker: any) => worker.UserWorker.avatar
          ),
          worker_id: task.task_user_worker?.map(
            (worker: any) => worker.UserWorker.uid
          ),
          worker_name: task.task_user_worker?.map(
            (worker: any) => worker.UserWorker.first_name
          ),
        };
      })
      .filter((task) => task !== null);
    return tasks;
  }

  if (userRole === "worker") {
    let tasks: any = [];
    const { data: relations } = await supabase
      .from("task_user_worker")
      .select("task_id")
      .eq("user_worker_id", userData.user?.id ?? "");
    if (!relations) return [];
    await Promise.all(
      relations.map(async (relation: any) => {
        const { data, error } = await supabase
          .from("Task")
          .select("id, uid, title, start_date, end_date, status")
          .eq("department_id", department_id)
          .eq("uid", relation.task_id)
          .lte(
            "start_date",
            `${date.getFullYear()}-${
              date.getMonth() + 1
            }-${date.getDate()}T23:59:59.999Z`
          )
          .gte(
            "start_date",
            `${date.getFullYear()}-${
              date.getMonth() + 1
            }-${date.getDate()}T00:00:00.000Z`
          );
        if (error) {
          console.log("error: ", error);
        }

        data &&
          data[0] &&
          tasks.push({
            id: data[0]?.uid,
            title: data[0]?.title,
            startTime: data[0]?.start_date,
            endTime: data[0]?.end_date,
            status: data[0]?.status,
          });
      })
    );
    return tasks;
  }
  //student
  // if (userRole === "student") {
  //   let tasks: any = [];
  //   const { data: relations } = await supabase
  //     .from("task_user_student")
  //     .select("task_id")
  //     .eq("user_student_id", userData.user?.id ?? "");
  //   if (!relations) return [];
  //   await Promise.all(
  //     relations.map(async (relation: any) => {
  //       const { data, error } = await supabase
  //         .from("Task")
  //         .select("id, uid, title, start_date, end_date, status")
  //         .eq("department_id", department_id)
  //         .eq("uid", relation.task_id)
  //         .lte(
  //           "start_date",
  //           `${date.getFullYear()}-${
  //             date.getMonth() + 1
  //           }-${date.getDate()}T23:59:59.999Z`
  //         )
  //         .gte(
  //           "start_date",
  //           `${date.getFullYear()}-${
  //             date.getMonth() + 1
  //           }-${date.getDate()}T00:00:00.000Z`
  //         );
  //       if (error) {
  //         console.log("error: ", error);
  //       }

  //       data && data[0] &&
  //         tasks.push({
  //           id: data[0]?.uid,
  //           title: data[0]?.title,
  //           startTime: data[0]?.start_date,
  //           endTime: data[0]?.end_date,
  //           status: data[0]?.status,
  //         });
  //     })
  //   );
  //   return tasks;
  // }

  const { data, error } = await supabase
    .from("Task")
    .select(query)
    .eq("department_id", department_id)
    .lte(
      "start_date",
      `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}T23:59:59.999Z`
    )
    .gte(
      "start_date",
      `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}T00:00:00.000Z`
    );
  if (error) {
    console.log("error2: ", error);
    return;
  }

  const tasks = data
    .map((task: any) => {
      return {
        id: task.uid,
        title: task.title,
        startTime: task.start_date,
        endTime: task.end_date,
        status: task.status,
        avatarUrl: task.task_user_worker?.map(
          (worker: any) => worker.UserWorker.avatar
        ),
        worker_id: task.task_user_worker?.map(
          (worker: any) => worker.UserWorker.uid
        ),
        worker_name: task.task_user_worker?.map(
          (worker: any) => worker.UserWorker.first_name
        ),
      };
    })
    .filter((task) => task !== null);
  return tasks;
}

export default fetchClientTasks;
