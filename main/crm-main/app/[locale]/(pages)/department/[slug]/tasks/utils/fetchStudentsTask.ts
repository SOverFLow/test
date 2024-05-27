"use server";
import getTablePermissions from "@/utils/fetchingWithRole/getTablePermissions";
import { getDbOnSever } from "@/utils/supabase/cookie";

export default async function fetchStudentsTask(taskId: string) {
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
        "task_user_students",
        "task_id, user_student_id",
        [
            {
                tableName: "Student",
                rows: ["uid", "first_name", "last_name", "avatar", "level", "notes", "budget", "client_id"],
            },
        ]
    );
    const { data: userData } = await supabase.auth.getUser();
    let workers: any[] = [];
    if (userData.user?.role === "super_admin") {
        const { data, error } = await supabase
            .from("task_user_students")
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
            .from("task_user_students")
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