"use server";
import { getDbOnSever } from "@/utils/supabase/cookie";

const checkIfPasswordIsCorrect = async (password: string) => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase.rpc("verify_user_password", {
    password: password,
  });
  if (error) {
    console.error("Error fetching Department", error);
    return false;
  }
  return data;
};

const deleteDepartment = async (departmentId: string) => {
  const supabase = await getDbOnSever();
  const { error } = await supabase
    .from("Department")
    .delete()
    .eq("uid", departmentId);
  if (error) {
    console.log("error:", error);
    return error;
  }
  return error;
};

export default checkIfPasswordIsCorrect;
export { deleteDepartment };
