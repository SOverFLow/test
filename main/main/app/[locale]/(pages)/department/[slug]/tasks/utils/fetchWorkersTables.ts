"use server";
import { createClient } from "@/utils/supabase/client";
import { Task } from "./types";
import getTablePermissions from "@/utils/fetchingWithRole/getTablePermissions";
import { getDbOnSever } from "@/utils/supabase/cookie";

export default async function fetchWorkersTables(taskId: string) {
    const supabase = await getDbOnSever();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user || !user.role) {
        console.log("user role not found");
        return;
    }
    const query = await getTablePermissions(
        user.role,
        "task_user_worker",
        "task_id, user_worker_id",
        [
            {
                tableName: "UserWorker",
                rows: ["uid", "first_name", "last_name", "avatar", "salary_hour", "salary_day", "salary_month"],
            },
        ]
    );
    const { data: userData } = await supabase.auth.getUser();
    let workers: any[] = [];
    if (userData.user?.role === "super_admin") {
        const { data, error } = await supabase
            .from("task_user_worker")
            .select(query)
            .eq("task_id", taskId)
        if (error) {
            console.log("error2: ", error);
            return;
        }
        console.log("data admin: ", data);
        workers = data;
    }
    if (userData.user?.role === "client") {
        const { data, error } = await supabase
            .from("task_user_worker")
            .select(query)
            .eq("task_id", taskId)
        if (error) {
            console.log("error2: ", error);
            return;
        }
        console.log("data client: ", data);
        workers = data;
    }
    if (userData.user?.role === "worker") {
        const { data, error } = await supabase
            .from("task_user_worker")
            .select(query)
            .eq("task_id", taskId)
        if (error) {
            console.log("error2: ", error);
            return;
        }
        console.log("data worker: ", data);
        workers = data;
    }
    return workers;
}