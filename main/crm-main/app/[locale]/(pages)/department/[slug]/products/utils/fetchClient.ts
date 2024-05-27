import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { createClient } from "@/utils/supabase/client";

export const fetchClientCurrency = async (department_id: string) => {
    const supabase = await createClient();
    const userRole = (await supabase.auth.getUser()).data.user?.role;
    if (!userRole || !department_id) {
      return [];
    }
    const query = await getTablePermissionForSpecificRows(
      userRole,
      "DepartmentSettings",
      ["currency"]
    );
    const { data, error } = await supabase
      .from("DepartmentSettings")
      .select(query)
      .eq("department_id", department_id)
      
    if (error) {
      console.log("error currency", error);
      return;
    } else if (data && data.length > 0) {
      const currencyData = data as any[];
      return currencyData[0]?.currency;
    }
  };