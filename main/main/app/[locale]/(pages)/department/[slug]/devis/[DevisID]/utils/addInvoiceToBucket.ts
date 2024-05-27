import { createClient } from "@/utils/supabase/client";
import { v4 } from "uuid";

const addInvoiceToBucket = async (
  slugName: string,
  invoiceId: string,
  file:any
) => {
  const supabase = createClient();
  const path = `${slugName}/${v4()}.pdf`;
  const { data: dt, error } = await supabase.storage
    .from("pdf")
    .upload(path, file);
  console.log("data", dt);
  if (error) {
    console.log("error", error);
    return;
  }

  const response = supabase.storage.from("pdf").getPublicUrl(path);
  const data: { publicUrl: string } = response.data as {
    publicUrl: string;
  };
  
  console.log("data", data);
  const { data: invoData, error: invoErr } = await supabase
    .from("Invoice")
    .update({ link_in_bucket: data.publicUrl })
    .eq("uid", invoiceId);
  if (invoErr) {
    console.log("error", error);
    return;
  }

  return data.publicUrl;
};

export default addInvoiceToBucket;
