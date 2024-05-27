import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getBiens(department_id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }

  const query = await getTablePermissionForSpecificRows(user.role, "Bien", [
    "uid",
    "name",
  ]);
    const { data: BienData, error } = await supabase
      .from("Bien")
      .select(query)
      .eq("department_id", department_id)
      .is("client_id", null)
      if (BienData) {
        const biens = BienData.map((bien) => {
          return {
            uid: (bien as { uid?: string }).uid ?? "",
            name: (bien as { name?: string }).name ?? "",
          };
        });
        return biens;
      }
  
      return [];
  }