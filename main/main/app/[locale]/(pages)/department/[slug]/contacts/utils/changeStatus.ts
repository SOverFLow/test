'use server';

import { getDbOnSever } from "@/utils/supabase/cookie";

const changeStatus = async (status: string, id: string) => {
    const supabase = await getDbOnSever();
    const { data, error } = await supabase
        .from("Contact")
        .update({ status })
        .eq("uid", id);
    if (error) {
        console.error(error);
    }
    if (status === "Validated") {
        // create client
    }
    return ;
}

export default changeStatus;
