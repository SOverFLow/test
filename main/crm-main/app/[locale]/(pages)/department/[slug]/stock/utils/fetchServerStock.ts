"use server";
import { createClient } from "@/utils/supabase/actions";
import { Stock } from "./types";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { cookies } from "next/headers";

async function fetchServerStock(
  department_id: string
): Promise<Stock[] | undefined> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }
  const query = await getTablePermissionForSpecificRows(user.role, "Stock", [
    "expiry_date",
    "name",
    "location",
    "owner",
    "payment_method",
    "purchase_date",
    "type",
    "department_id",
    "uid",
  ]);
  const { data, error } = await supabase
    .from("Stock")
    .select(query)
    .eq("department_id", department_id);
  if (error) {
    console.log("error: ", error);
    return;
  }
  console.log("data: ", data);

  const Stocks = data.map((stock: any) => {
    return {
      expiry_date: stock.expiry_date,
      location: stock.location,
      owner: stock.owner,
      name: stock.name,
      payment_method: stock.payment_method,
      purchase_date: stock.purchase_date,
      type: stock.type,
      department_id: stock.department_id,
      uid: stock.uid,
    };
  });
  console.log("Stocks: ", Stocks);
  return Stocks;
}

export default fetchServerStock;
