import { createClient } from "@/utils/supabase/client";
import convertImageToWebP from "@/utils/webPconverter";
import { v4 } from "uuid";

const uploadProductImage = async (imgFile: File) => {
  const supabase = createClient();
  const result = await convertImageToWebP(imgFile);
  const { error, data } = await supabase.storage
    .from("Photos")
    .upload(`product/${v4()}.webp`, result as File, {
      cacheControl: "1",
      upsert: true,
    });
  if (error) {
    console.error("Error uploading file", error);
    return { error: error.message, data: null };
  }
  const response = supabase.storage.from("Photos").getPublicUrl(data.path);
  console.log("data: ", response.data.publicUrl);
  return { error: null, data: response.data };
};

export async function getSuppliers(department_id: string) {
  const supabase = createClient();

  const { data: SuppliersData, error: error } = await supabase
    .from("Supplier")
    .select("*")
    .eq("department_id", department_id);

  if (SuppliersData) {
    const suppliers = SuppliersData.map((supplier) => {
      return {
        uid: supplier.uid ?? "",
        name: supplier.name ?? "",
        email: supplier.email ?? "",
        phone_number: supplier.phone_number ?? "",
      };
    });
    return suppliers;
  }
}


export { uploadProductImage };
