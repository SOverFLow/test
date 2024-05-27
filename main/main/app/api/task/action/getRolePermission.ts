"use server";
import getTablePermissions from "@/utils/fetchingWithRole/getTablePermissions";
import { createClient } from "@/utils/supabase/actions";
import { getDbOnSever } from "@/utils/supabase/cookie";
import { cookies } from "next/headers";

const fetchTablesNameAndPriviligesForRole = async (selectedRole: string) => {
    const supabase = await getDbOnSever();
    const user = await supabase.auth.getUser();
    let { data: allTables, error: tablesError } = await supabase.rpc(
        "get_public_table_names"
    );

    const { data, error } = await supabase.rpc("get_column_privileges", {
        grantee_name: user.data.user?.role!,
        tables_input: allTables as string[],
    });

    if (error || tablesError) console.log("error", error);
    return { data, error };
};


export default fetchTablesNameAndPriviligesForRole;