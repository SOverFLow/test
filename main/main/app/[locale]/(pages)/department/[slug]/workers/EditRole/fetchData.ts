"use server";
import { getDbOnSever } from "@/utils/supabase/cookie";

const fetchTablesNameAndPriviligesForRole = async (selectedRole: string) => {
  const supabase = await getDbOnSever();
  let { data: allTables, error: tablesError } = await supabase.rpc(
    "get_public_table_names"
  );
  const { data, error } = await supabase.rpc("get_column_privileges", {
    grantee_name: selectedRole,
    tables_input: allTables as string[],
  });

  if (error || tablesError) console.log("error", error);
  return { data, error };
};

const fetchRolesName = async () => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase.from("Role").select("title");
  if (error) console.error("Error:", error);
  return { data, error };
};

const getRoleOfWorker = async (workerId: string) => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase.rpc('get_user_role',{
    user_id: workerId
  })
  if (error) console.error("Error:", error);
  return data;
};

const createNewRole = async (newRoleName: string, departmentUid: string) => {
  const supabase = await getDbOnSever();
  const { error } = await supabase.rpc("create_and_adjust_role", {
    data_submitted: {},
    new_role_name: newRoleName,
    department_uid: departmentUid,
  });
  if (error) {
    console.error("Error createNewRole:", error);
    return { error };
  }
  const { data: roles, error: errorRoles } = await fetchRolesName();
  if (errorRoles) console.error("Error:", errorRoles);
  return { data: roles, error: errorRoles };
};

export {
  fetchTablesNameAndPriviligesForRole,
  fetchRolesName,
  createNewRole,
  getRoleOfWorker,
};
