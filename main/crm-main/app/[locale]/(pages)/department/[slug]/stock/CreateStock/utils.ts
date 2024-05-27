import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getProducts(department_id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }
  const query = await getTablePermissionForSpecificRows(user.role, "Product", [
    "created_at",
    "updated_at",
    "uid",
    "id",
    "name",
    "department_cost_id",
    "task_id",
    "supplier_id",
    "buy_price",
    "sell_price",
    "entry_date",
    "exit_date",
    "expiration_date",
    "payment_method",
    "stock_id",
    "department_id",
    "image",
    "quantity",
    "serial_number",
    "stock_limit_for_alert",
    "desired_stock",
    "notes",
  ]);

  const { data, error } = await supabase
    .from("Product")
    .select(query)
    .eq("department_id", department_id)
    .is("stock_id", null);
  if (error) {
    console.log("error: ", error);
    return;
  }
  return data;
}
