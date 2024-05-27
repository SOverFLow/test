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

async function fetchTasksPerDate(
  department_id: string,
  start_date: Date,
  end_date: Date,
  userRole: string
): Promise<DbTask[] | undefined> {
  const supabase = createClient();
  const query = await getTablePermissionForSpecificRows(userRole, "Task", [
    "confirmed",
    "start_date",
  ]);
  const { data: userData } = await supabase.auth.getUser();
  if (userData.user?.role === "super_admin") {
    const { data, error } = await supabase
      .from("Task")
      .select(query)
      .eq("department_id", department_id)
      .gte(
        "start_date",
        `${start_date.getFullYear()}-${
          start_date.getMonth() + 1
        }-${start_date.getDate()}T00:00:00.000Z`
      )
      .lte(
        "start_date",
        `${end_date.getFullYear()}-${
          end_date.getMonth() + 1
        }-${end_date.getDate()}T23:59:59.999Z`
      );
    if (error) {
      console.log("error: ", error);
      return;
    }
    return data as any;
  } else if (userData.user?.role === "client") {
    const { data, error } = await supabase
      .from("Task")
      .select(query)
      .eq("department_id", department_id)
      .eq("client_id", userData?.user?.id)
      .gte(
        "start_date",
        `${start_date.getFullYear()}-${
          start_date.getMonth() + 1
        }-${start_date.getDate()}T00:00:00.000Z`
      )
      .lte(
        "start_date",
        `${end_date.getFullYear()}-${
          end_date.getMonth() + 1
        }-${end_date.getDate()}T23:59:59.999Z`
      );
    if (error) {
      console.log("error: ", error);
      return;
    }
    return data as any;
  } else if (userData.user?.role === "worker") {
    let tasks: any = [];
    const { data: relations } = await supabase
      .from("task_user_worker")
      .select("task_id")
      .eq("user_worker_id", userData.user?.id);
    if (!relations) return [];
    await Promise.all(
      relations.map(async (relation: any) => {
        const { data, error } = await supabase
          .from("Task")
          .select(query)
          .eq("department_id", department_id)
          .eq("uid", relation.task_id)
          .gte(
            "start_date",
            `${start_date.getFullYear()}-${
              start_date.getMonth() + 1
            }-${start_date.getDate()}T00:00:00.000Z`
          )
          .lte(
            "start_date",
            `${end_date.getFullYear()}-${
              end_date.getMonth() + 1
            }-${end_date.getDate()}T23:59:59.999Z`
          );
        if (error) {
          console.log("error: ", error);
        }
        if (data && data[0]) {
          tasks.push(data[0] as any);
        }
      })
    );
    return tasks;
  }
  return [];
}

interface DbTask {
  confirmed: boolean;
  start_date: string;
}

async function tasksCounter(
  department_id: string,
  start_date: string,
  end_date: string,
  filter: string
) {
  const supabase = createClient();
  const userRole = (await supabase.auth.getUser()).data.user?.role;
  if (!userRole || !department_id || !start_date || !end_date) {
    return [];
  }
  const currentDate = new Date();
  let startDate: Date;
  let endDate: Date;

  if (filter === "Week") {
    startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay()
    );
    endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + (6 - currentDate.getDay())
    );
  } else if (filter === "Month") {
    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
  } else if (filter === "Year") {
    startDate = new Date(currentDate.getFullYear(), 0, 1);
    endDate = new Date(currentDate.getFullYear(), 11, 31);
  } else {
    startDate = stringToDate(start_date);
    endDate = stringToDate(end_date);
  }

  const data = await fetchTasksPerDate(
    department_id,
    startDate,
    endDate,
    userRole
  );
  if (filter === "Week") {
    const taskCounts: {
      [name: string]: { confirmed: number; notConfirmed: number };
    } = {};
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    daysOfWeek.forEach((day) => {
      taskCounts[day] = { confirmed: 0, notConfirmed: 0 };
    });
    data &&
      data.forEach((task: DbTask) => {
        const date = new Date(task.start_date);
        const dayOfWeek = date.toLocaleDateString(undefined, {
          weekday: "short",
        });
        if (task.confirmed) {
          taskCounts[dayOfWeek].confirmed++;
        } else {
          taskCounts[dayOfWeek].notConfirmed++;
        }
      });
    const tasks: { name: string; confirmed: number; notConfirmed: number }[] =
      [];
    for (const name in taskCounts) {
      const { confirmed, notConfirmed } = taskCounts[name];
      tasks.push({ name, confirmed, notConfirmed });
    }
    return tasks;
  } else if (filter === "Month") {
    const taskCounts: {
      [name: string]: { confirmed: number; notConfirmed: number };
    } = {};
    data &&
      data.forEach((task: DbTask) => {
        const date = new Date(task.start_date);
        const day = date.getDate();
        const month = date.toLocaleDateString(undefined, { month: "short" });
        const key = `${month} ${day}`;
        if (!taskCounts[key]) {
          taskCounts[key] = { confirmed: 0, notConfirmed: 0 };
        }
        if (task.confirmed) {
          taskCounts[key].confirmed++;
        } else {
          taskCounts[key].notConfirmed++;
        }
      });
    const tasks: { name: string; confirmed: number; notConfirmed: number }[] =
      [];
    for (const name in taskCounts) {
      const { confirmed, notConfirmed } = taskCounts[name];
      tasks.push({ name, confirmed, notConfirmed });
    }
    tasks.sort((a, b) => {
      const [aMonth, aDay] = a.name.split(" ");
      const [bMonth, bDay] = b.name.split(" ");
      const aDate = new Date(0, 0, parseInt(aDay), 0, 0, 0);
      const bDate = new Date(0, 0, parseInt(bDay), 0, 0, 0);
      return aDate.getTime() - bDate.getTime();
    });
    return tasks;
  } else if (filter === "Year") {
    const taskCounts: {
      [year: string]: {
        [month: string]: { confirmed: number; notConfirmed: number };
      };
    } = {};
    data &&
      data.forEach((task: DbTask) => {
        const date = new Date(task.start_date);
        const year = date.getFullYear().toString();
        const month = date.toLocaleDateString(undefined, { month: "short" });
        const key = `${month}`;
        if (!taskCounts[year]) {
          taskCounts[year] = {};
        }
        if (!taskCounts[year][key]) {
          taskCounts[year][key] = { confirmed: 0, notConfirmed: 0 };
        }
        if (task.confirmed) {
          taskCounts[year][key].confirmed++;
        } else {
          taskCounts[year][key].notConfirmed++;
        }
      });
    const tasks: { name: string; confirmed: number; notConfirmed: number }[] =
      [];
    for (const year in taskCounts) {
      const months = taskCounts[year];
      const sortedMonths = Object.keys(months).sort((a, b) => {
        const monthOrder = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return monthOrder.indexOf(a) - monthOrder.indexOf(b);
      });
      for (const month of sortedMonths) {
        if (month !== "confirmed" && month !== "notConfirmed") {
          const { confirmed, notConfirmed } = months[month];
          tasks.push({ name: month, confirmed, notConfirmed });
        }
      }
    }
    return tasks;
  } else {
    const taskCounts: {
      [name: string]: { confirmed: number; notConfirmed: number };
    } = {};
    const tasks: {
      name: string;
      confirmed: number;
      notConfirmed: number;
    }[] = [];
    data &&
      data.forEach((task: DbTask) => {
        const date = task.start_date.substring(0, 10);
        if (!taskCounts[date]) {
          taskCounts[date] = { confirmed: 0, notConfirmed: 0 };
        }
        if (task.confirmed) {
          taskCounts[date].confirmed++;
        } else {
          taskCounts[date].notConfirmed++;
        }
      });
    for (const name in taskCounts) {
      const { confirmed, notConfirmed } = taskCounts[name];
      tasks.push({ name, confirmed, notConfirmed });
    }
    return tasks;
  }
}

export { tasksCounter, fetchTasksPerDate };
