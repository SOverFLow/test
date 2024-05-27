"use server";

import { getDbOnSever } from "@/utils/supabase/cookie";

export const getIfDepartmentIsFormation = async (slug: string) => {
    const supabase = await getDbOnSever();
    const { data, error } = await supabase
      .from("Department")
      .select("is_center_formation")
      .eq("uid", slug);
    if (!data) return false;
    if (error) {
      console.log(error);
      return false;
    }
    return data[0].is_center_formation as boolean;
  };