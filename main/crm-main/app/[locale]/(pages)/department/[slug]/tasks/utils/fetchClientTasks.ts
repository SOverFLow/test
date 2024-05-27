import { createClient } from "@/utils/supabase/client";
import { Task } from "./types";
import getTablePermissions from "@/utils/fetchingWithRole/getTablePermissions";

async function fetchClientTasks(
  department_id: string,
  date: Date,
  userRole: string
): Promise<Task[] | undefined> {
  const supabase = createClient();
  const query = await getTablePermissions(
    userRole,
    "Task",
    "uid, title, cost, address, priority, start_date, end_date, column_id, status, confirmed",
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
      {
        tableName: "Client",
        rows: ["uid", "first_name", "last_name"],
      },
    ]
  );
  const { data: userData } = await supabase.auth.getUser();
  let tasks: any[] = [];
  if (userData.user?.role === "super_admin") {
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
    tasks = data;
  } else if (userData.user?.role === "client") {
    const { data, error } = await supabase
      .from("Task")
      .select(query)
      .eq("department_id", department_id)
      .eq("client_id", userData?.user?.id)
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
    tasks = data;
  } else if (userData.user?.role === "worker") {
    const { data: relations } = await supabase
      .from("task_user_worker")
      .select("task_id")
      .eq("user_worker_id", userData.user?.id);
    if (!relations) return;
    await Promise.all(
      relations.map(async (relation: any) => {
        const { data, error } = await supabase
          .from("Task")
          .select(query)
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
          console.log("error3: ", error);
          return;
        }
        if (data && data[0]) {
          tasks.push(data[0] as any);
        }
      })
    );
  }
  return tasks
    .map((task: any) => {
      return {
        uid: task.uid,
        title: task.title,
        cost: task.cost,
        address: task.address,
        priority: task.priority,
        column_id: task.column_id,
        start_date: task.start_date,
        end_date: task.end_date,
        Workers: task.task_user_worker?.map((worker: any) => worker.UserWorker),
        Client: task.Client,
        status: task.status,
        confirmed: task.confirmed,
      };
    })
    .filter((task: any) => task !== null);
}

async function ClientFetchTasksLazy(
  department_id: string,
  count: number,
  page: number,
  userRole: string
): Promise<Task[] | undefined> {
  const supabase = createClient();
  const query = await getTablePermissions(
    userRole,
    "Task",
    "uid, title, cost, selling_price, profit_net, address, priority, start_date, end_date, status, confirmed",
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
      {
        tableName: "Client",
        rows: ["uid", "first_name", "last_name"],
      },
      {
        tableName: "TaskColumn",
        rows: ["uid", "title"],
      },
    ]
  );
  const { data: userData } = await supabase.auth.getUser();
  let tasks: any[] = [];
  if (userData.user?.role === "super_admin") {
    const { data, error } = await supabase
      .from("Task")
      .select(query)
      .eq("department_id", department_id)
      .order("start_date", { ascending: false })
      .range(count * page, page * count + count - 1);
    if (error) {
      console.log("error2: ", error);
      return;
    }
    tasks = data;
  } else if (userData.user?.role === "client") {
    const { data, error } = await supabase
      .from("Task")
      .select(query)
      .eq("department_id", department_id)
      .eq("client_id", userData?.user?.id)
      .order("start_date", { ascending: false })
      .range(count * page, page * count + count - 1);
    if (error) {
      console.log("error2: ", error);
      return;
    }
    tasks = data;
  } else if (userData.user?.role === "worker") {
    const { data: relations } = await supabase
      .from("task_user_worker")
      .select("task_id")
      .eq("user_worker_id", userData.user?.id);
    if (!relations) return;
    await Promise.all(
      relations.map(async (relation: any) => {
        const { data, error } = await supabase
          .from("Task")
          .select(query)
          .eq("uid", relation.task_id)
          .eq("department_id", department_id)
          .order("start_date", { ascending: false })
          .range(count * page, page * count + count - 1);
        if (error) {
          console.log("error3: ", error);
          return;
        }
        if (data && data[0]) {
          tasks.push(data[0] as any);
        }
      })
    );
  }
  return tasks.map((task: any) => {
    return {
      uid: task.uid,
      title: task.title,
      cost: task.cost,
      selling_price: task.selling_price,
      profit: task.profit_net,
      address: task.address,
      priority: task.priority,
      column_id: task.Status?.uid || null,
      column_title: task.Status ? task.Status.title : "No status",
      start_date: task.start_date,
      end_date: task.end_date,
      Workers: task.task_user_worker?.map((worker: any) => worker.UserWorker),
      Client: task.Client,
      status: task.status,
      confirmed: task.confirmed,
    };
  });
  return tasks;
}

async function updateTaskColumn(task_id: string, column_id: string | null) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Task")
    .update({ column_id: column_id })
    .eq("uid", task_id)
    .select("column_id");
  if (error) {
    console.log("error: ", error);
    return;
  }
}

async function fetchTotalTasksCount(department_id: string) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (userData.user?.role === "super_admin") {
    const { error, count } = await supabase
      .from("Task")
      .select("*", { count: "exact", head: true })
      .eq("department_id", department_id);
    if (error) {
      console.log("error: ", error);
      return;
    }
    return count;
  } else if (userData.user?.role === "client") {
    const { error, count } = await supabase
      .from("Task")
      .select("*", { count: "exact", head: true })
      .eq("department_id", department_id)
      .eq("client_id", userData?.user?.id);
    if (error) {
      console.log("error: ", error);
      return;
    }
    return count;
  } else if (userData.user?.role === "worker") {
    const { count, error } = await supabase
      .from("task_user_worker")
      .select("*", { count: "exact", head: true })
      .eq("user_worker_id", userData.user?.id);
    if (error) {
      console.log("error: ", error);
      return;
    }
    return count;
  }
}

export { updateTaskColumn, fetchTotalTasksCount, ClientFetchTasksLazy };
export default fetchClientTasks;
