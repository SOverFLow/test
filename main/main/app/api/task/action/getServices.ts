"use server";
import { createClient } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

export const getServices = async (department_id: string, client_id: string, bien_id?: string) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const user = await supabase.auth.getUser();

    if (!user) {
      return { error: "User must be logged in to fetch services." };
    }

    try {
        let query = supabase
            .from("Service")
            .select("uid, title, selling_price_ht, selling_price_ttc, units, buying_price_ht, buying_price_ttc, tva")
            .eq("department_id", department_id)
            // .eq("client_id", client_id);

        // if (bien_id) {
        //     query = query.eq("bien_id", bien_id);  // Only add bien_id filter if it is not null
        // }

        const { data, error } = await query;

        if (error) {
            console.error("An error occurred 33 22 99", error);
            return {
                error: "An error occurred while fetching Department services data",
            };
        } else {
            return {
                success: data.map((service: any) => {
                    return {
                        uid: service.uid,
                        title: service.title ?? '',
                        selling_price_ht: service.selling_price_ht ?? '',
                        selling_price_ttc: service.selling_price_ttc ?? '',
                        buying_price_ht: service.buying_price_ht ?? '',
                        buying_price_ttc: service.buying_price_ttc ?? '',
                        units: service.units ?? '',
                        tva: service.tva ?? '',
                    };
                }),
            };
        }
    } catch (error) {
        console.error('Error fetching services:', error);
        return {
            error: "An error occurred while processing your request."
        };
    }
};
