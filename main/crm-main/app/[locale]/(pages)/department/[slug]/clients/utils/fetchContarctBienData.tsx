'use server';

import { getDbOnSever } from "@/utils/supabase/cookie";

const fetchBienData = async (clientId: string, table:"Bien"|"Contract"): Promise<string[]> => {
    const supabase = await getDbOnSever();
    const { data, error } = await supabase
        .from(table)
        .select("name")
        .eq("client_id", clientId);
    if (error) {
        console.error("Error fetching data from Bien table", error);
        return [];
    }
    console.log('contarrdct data',data)
    return data?.map((item:any) => item.name) as string[] || [];
}

export default fetchBienData;
