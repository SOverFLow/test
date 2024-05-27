'use server';
import { getDbOnSever } from "@/utils/supabase/cookie";

const processData = (data: any) => {
  const results: { [key: string]: { falsed: string; trued: string } } = {};

  Object.keys(data).forEach((parentKey) => {
    let falsed: string[] = [];
    let trued: string[] = [];
    Object.keys(data[parentKey]).forEach((childKey) => {
      if (data[parentKey][childKey]) {
        trued.push(childKey);
      } else {
        falsed.push(childKey);
      }
    });

    results[parentKey] = {
      falsed: falsed.join(","),
      trued: trued.join(","),
    };
  });

  return results;
};
const treatRoleSubmit = async (
  dataSubmited: { [key: string]: { [key: string]: boolean } },
  roleName: string,
  userUid: string
) => {
  const permissionsData = processData(dataSubmited);
  const supabase = await getDbOnSever();
  if (!roleName) {
    console.error("Error: roleName is missing");
    return;
  }
  const { error } = await supabase.rpc("adjust_permissions2", {
    json_data: permissionsData,
    role_name: roleName,
    user_id: userUid,
  });
  const { error: udpateError } = await supabase
    .from("Role")
    .update({ permissions: permissionsData })
    .eq("title", roleName);
  if (udpateError || error) {
    console.error("updateError:", udpateError);
    console.error("error:", error);
    return;
  }
};

export default treatRoleSubmit;
