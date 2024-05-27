'use server';
import { getDbOnSever } from "@/utils/supabase/cookie";


const fetchInvoiceId = async (taskId: string) => {
    const supabase = await getDbOnSever();
    const { data, error } = await supabase.from("Task").select("Devis(uid)").eq("uid", taskId);
    if (error) {
        console.log("error", error);
        return "";
    }
    return data[0].Devis[0]?.uid || "";
};

export default fetchInvoiceId;
