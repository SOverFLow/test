import { getDbOnSever } from "@/utils/supabase/cookie";

export const dynamic = "force-dynamic";

export async function CreateStock(Stock: any) {
  const supabase = await getDbOnSever();

  const { data, error: dataError } = await supabase
    .from("Stock")
    .insert([Stock])
    .select("*");

  if (dataError) {
    throw dataError;
  }

  return data;
}

export async function DeleteStock(stock_id: string) {
  const supabase = await getDbOnSever();

  const { data, error: dataError } = await supabase
    .from("Stock")
    .delete()
    .eq("uid", stock_id)
    .select("*");

  if (dataError) {
    throw dataError;
  }
  return "Stock deleted successfully";
}

export async function EditStock(stock_id: string, stock: any) {
  const supabase = await getDbOnSever();

  const { data, error: dataError } = await supabase
    .from("Stock")
    .update(stock)
    .eq("uid", stock_id)
    .select("*");

  if (dataError) {
    throw dataError;
  }

  return data;
}

export async function EditProductStock(
  stock_id: string,
  product_ids: string[]
) {
  const supabase = await getDbOnSever();

  for (let index = 0; index < product_ids.length; index++) {
    const product_id = product_ids[index];
    const { data, error: dataError } = await supabase
      .from("Product")
      .update({ stock_id })
      .eq("uid", product_id);

    if (dataError) {
      throw dataError;
    }
  }

  return "Products updated successfully";
}

export async function RemoveStockIdFromProducts(stock_id: string) {
  const supabase = await getDbOnSever();

  const { data, error: dataError } = await supabase
    .from("Product")
    .update({ stock_id: null })
    .eq("stock_id", stock_id);

  if (dataError) {
    throw dataError;
  }

  return data;
}
