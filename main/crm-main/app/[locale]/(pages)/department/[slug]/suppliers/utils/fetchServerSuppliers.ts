import { getDbOnSever } from "@/utils/supabase/cookie";
import { Supplier } from "./types";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";

async function fetchServerSuppliers(
  department_id: string
): Promise<Supplier[] | undefined> {
  const supabase = await getDbOnSever();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }
  const query = await getTablePermissionForSpecificRows(user.role, "Supplier", [
    "uid",
    "name",
    "email",
    "phone_number",
    "created_at",
    "department_id",
  ]);
  const { data, error } = await supabase
    .from("Supplier")
    .select(query)
    .eq("department_id", department_id);

  if (error) {
    console.log("error: ", error);
    return;
  }

  const Suppliers = data.map((supplier: any) => {
    return {
      uid: supplier.uid,
      name: supplier.name,
      email: supplier.email,
      phone_number: supplier.phone_number,
      created_at: supplier.created_at.slice(0, 10),
      department_id: supplier.department_id,
    };
  });
  return Suppliers;
}

export default fetchServerSuppliers;
