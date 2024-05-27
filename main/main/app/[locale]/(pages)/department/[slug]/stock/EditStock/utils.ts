import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getStockData(stock_id: number | string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }

  const query = await getTablePermissionForSpecificRows(user.role, "Stock", [
    "created_at",
    "updated_at",
    "expiry_date",
    "location",
    "owner",
    "payment_method",
    "purchase_date",
    "type",
    "department_id",
    "uid",
    "name",
  ]);

  const { data: Stock }: any = await supabase
    .from("Stock")
    .select(query)
    .eq("uid", stock_id)
    .single();
  if (Stock) {
    return {
      expiry_date: Stock.expiry_date ? Stock.expiry_date : "",
      location: Stock.location ? Stock.location : "",
      name: Stock.name ? Stock.name : "",
      owner: Stock.owner ? Stock.owner : "",
      payment_method: Stock.payment_method ? Stock.payment_method : "",
      purchase_date: Stock.purchase_date ? Stock.purchase_date : "",
      type: Stock.type ? Stock.type : 0.0,
      department_id: Stock.department_id ? Stock.department_id : "",
      uid: Stock.uid ? Stock.uid : "",
    };
  }
}

export async function getProductsOfStock(stock_id: string | number) {
  const { data, error } = await supabase
    .from("Product")
    .select("*")
    .eq("stock_id", stock_id);
  if (error) {
    console.log("error: ", error);
    return;
  }
  return data;
}

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
