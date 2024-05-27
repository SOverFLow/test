import { createClient } from "@/utils/supabase/client";

export default async function ConfermeInvoice(invoiceId: string) {
  const supabase = createClient();
  const { data: invoices, error: err1 } = await supabase
    .from("Devis")
    .select("confirmed")
    .eq("uid", invoiceId);
  if (err1) {
    console.log("err1: ", err1);
    return { data: null, error: "Something went wrong!" };
  }
  if (invoices[0].confirmed) {
    return { data: "Devis already confirmed", error: null };
  }

  const { data: invoice, error: err2 } = await supabase
    .from("Devis")
    .update({ confirmed: true, status: "Confirmed"})
    .eq("uid", invoiceId)
    .select("task_id");
  if (err2 || !invoice[0]) {
    console.log("err2: ", err2);
    return { data: null, error: "Something went wrong!" };
  }
  if (invoice[0].task_id) {
    const { data: task, error: err3 } = await supabase
      .from("Task")
      .update({ confirmed: true })
      .eq("uid", invoice[0].task_id);
    if (err3) {
      console.log("err3: ", err3);
      return { data: null, error: "Something went wrong!" };
    }
  }
  return { data: "Devis confirmed successfully", error: null };
}
