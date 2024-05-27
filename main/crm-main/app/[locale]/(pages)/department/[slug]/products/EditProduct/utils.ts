import { createClient } from "@/utils/supabase/client";
import { Product } from "../types/product";

const supabase = createClient();

export async function getProductData(product_id: number | string): Promise<Product | null>{
  const { data: product } = await supabase
    .from("Product")
    .select("*")
    .eq("uid", product_id)
    .single();
  if (product) {
    return {
      name: product.name,
      quantity: product.quantity ?? 0,
      sell_price: product.sell_price ?? 0,
      buy_price: product.buy_price ?? 0,
      supplier_id: product.supplier_id,
      entry_date: product.entry_date ? new Date(product.entry_date) : null,
      exit_date: product.exit_date ? new Date(product.exit_date) : null,
      expiration_date: product.expiration_date ? new Date(product.expiration_date) : null,
      payment_method: product.payment_method ?? "",
      weight: product.weight ?? 0,
      length: product.length ?? 0,
      width: product.width ?? 0,
      height: product.height ?? 0,
      area: product.area ?? 0,
      volume: product.volume ?? 0,
      country_of_origin: product.country_of_origin ?? "",
      state_province_of_origin: product.state_province_of_origin ?? "",
      serial_number: product.serial_number ?? "",
      stock_limit_for_alert: product.stock_limit_for_alert ?? 0,
      desired_stock: product.desired_stock ?? 0,
      nature_of_product: product.nature_of_product ?? "",
      notes: product.notes ?? "",
      image: product.image ?? "",
      buy_tva: product.buy_tva,
      sell_tva: product.sell_tva,
    };
  }
    return null;
  }


  export async function deleteImage(imgUrl: string) {
    const supabase = createClient();
    const { error: storageError } = await supabase.storage
      .from("Photos")
      .remove([
        `product/${imgUrl.split("/").slice(-1).join("").split("?")[0]}`,
      ]);
    if (storageError) {
      console.error("Error deleting image1", storageError);
      return {
        type: "error",
        message: "Error deleting image",
      };
    }
    
    return {
      type: "success",
      message: "Image deleted successfully",
    };
  }