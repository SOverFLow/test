import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { getDbOnSever } from "@/utils/supabase/cookie";

async function fetchServerBiens(departmentId: string) {
  const supabase = await getDbOnSever();
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
    "type",
    "price",
    "location",
    "created_at",
    "status",
  ]);
  console.log("-------->query", query);
  console.log("-------->departmentId", departmentId);
  const { data, error } = await supabase
    .from("Bien")
    .select(query)
    .eq("department_id", departmentId);

  console.log("-------->data", data);
  if (error) {
    console.log(error);
    return;
  }
  return data.map((bien: any) => {
    return {
      uid: bien.uid,
      name: bien.name,
      type: bien.type,
      price: bien.price,
      location: bien.location,
      created_at: bien.created_at,
      status: bien.status ?? "No status",
    };
  });
}

export default fetchServerBiens;
