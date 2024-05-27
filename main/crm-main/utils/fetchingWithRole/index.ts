"use server";
import { getDbOnSever } from "../supabase/cookie";

const fetchingWithRole = async (role: string) => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("Role")
    .select("title, permissions")
    .eq("title", role);
  if (error) {
    console.error("Error:", error);
    return;
  }
  return data;
};

const fetchTableWithRole = async (role: string) => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("Role")
    .select("title")
    .eq("title", role);
  if (error) {
    console.error("Error:", error);
    return;
  }
  return data;
};

const getTablePermission = async (roleName: string, tableName: string) => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("Role")
    .select("permissions")
    .eq("title", roleName);
  if (error) {
    console.error("Error:", error);
    return;
  }
  const permissions = data[0].permissions as { [key: string]: any };
  if (!permissions[tableName]) {
    console.error("Error table name tablePermissions");
    return;
  }
  return permissions[tableName];
};

const getTablePermissionForSpecificRows = async (
  roleName: string,
  tableName: string,
  rows: string[]
) => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("Role")
    .select("permissions")
    .eq("title", roleName);
  if (error) {
    console.error("Error:", error);
    return;
  }
  const permissions = data[0]?.permissions as { [key: string]: any };
  if (!permissions || !permissions[tableName]) {
    console.error("Error table name rowtablePermissions");
    return;
  }
  const tablePermissions = permissions[tableName] as { [key: string]: any };
  const result = rows
    .map((row) => {
      return tablePermissions.trued.includes(row) ? row : "";
    })
    .filter((row) => row !== "");
  return result.join(",");
};

export default fetchingWithRole;

export {
  fetchTableWithRole,
  getTablePermission,
  getTablePermissionForSpecificRows,
};
