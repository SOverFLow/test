import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
export async function getSupplierData(supplier_id: number | string) {
  const { data: SupplierData, error: error } = await supabase
    .from("Supplier")
    .select("*")
    .eq("uid", supplier_id)
    .single();
  if (SupplierData) {
    return {
      name: SupplierData.name ?? "",
      email: SupplierData.email ?? "",
      phone_number: SupplierData.phone_number ?? "",
      zip_code: SupplierData.zip_code ?? "",
      city: SupplierData.city ?? "",
      state_province: SupplierData.state_province ?? "",
      address: SupplierData.address ?? "",
      country: SupplierData.country ?? "",
      website: SupplierData.website ?? "",
      cuurency: SupplierData.cuurency ?? "",
      supplier_type: SupplierData.supplier_type ?? "",
      profesional_id: SupplierData.profesional_id ?? "",
      supplier_category: SupplierData.supplier_category ?? "",
      tva: SupplierData.tva ?? 0,
      bank_account: SupplierData.bank_account ?? "",
    };
  }
}
