import { getDbOnSever } from "@/utils/supabase/cookie";
import { Product } from "./types";
import getTablePermissions from "@/utils/fetchingWithRole/getTablePermissions";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";

export function calcTTC(price: number, tva: number) {
  return (price * (tva / 100 + 1)).toFixed(2);
}

export async function fetchTva(tva_id: string) {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("TVA")
    .select("name, value")
    .eq("uid", tva_id)
    .single();
  if (error) {
    console.log("error: ", error);
    return;
  }
  return data;
}

async function fetchServerProducts(
  department_id: string
): Promise<Product[] | undefined> {
  const supabase = await getDbOnSever();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.role) {
    console.log("user role not found");
    return;
  }

  const query = await getTablePermissions(
    user.role,
    "Product",
    "buy_price, image, entry_date, exit_date, expiration_date, name, payment_method, quantity, sell_price, uid, nature_of_product, stock_limit_for_alert, sell_tva, buy_tva",
    []
  );

  const { data, error } = await supabase
    .from("Product")
    .select(query)
    .eq("department_id", department_id)
    .limit(25);
  if (error) {
    console.log("error: ", error);
    return;
  }

  let Products: Product[] = [];
  await Promise.all(
    data.map(async (product: any) => {
      const SellTva = await fetchTva(product.sell_tva);
      const BuyTva = await fetchTva(product.buy_tva);
      Products.push({
        buy_price: product.buy_price,
        entry_date: product.entry_date,
        exit_date: product.exit_date,
        expiration_date: product.expiration_date,
        id: product.id,
        name: product.name,
        payment_method: product.payment_method,
        quantity: product.quantity,
        sell_price: product.sell_price,
        department_cost_id: product.department_cost_id,
        department_id: product.department_id,
        stock_id: product.stock_id,
        supplier_id: product.supplier_id,
        image: product.image || null,
        task_id: product.task_id,
        uid: product.uid,
        product_family: product.nature_of_product,
        stock_limit_for_alert: product.stock_limit_for_alert,
        sell_tva: SellTva?.name || null,
        buy_tva: BuyTva?.name || null,
        sell_price_ttc: calcTTC(product.sell_price, SellTva?.value || 0),
        buy_price_ttc: calcTTC(product.buy_price, BuyTva?.value || 0)
      });
    })
  );
  return Products;
}

export default fetchServerProducts;
