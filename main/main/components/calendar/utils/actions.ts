"use server";

import { getDbOnAction } from "@/utils/supabase/cookie";

const updateEventDate = async (uid: string, startDate: string, endDate: string, isChecked:boolean) => {
    const supabase = await getDbOnAction();
    if (isChecked) {
        const {error:rpcError} = await supabase.rpc("rpc_function_to_update_linked_task_real_table", {
            task_id: uid,
            new_end_date: endDate,
        });
        if (rpcError) {
            throw rpcError;
        }
    }
    const { data, error } = await supabase.from("Task").update({
        start_date: startDate, 
        end_date: endDate,
    }).eq("uid", uid);
    if (error) {
        throw error;
    }
    console.log("data", data);
    return data;
};

export { updateEventDate };