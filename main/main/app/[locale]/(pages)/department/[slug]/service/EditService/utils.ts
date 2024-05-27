'use server';
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { getDbOnSever } from "@/utils/supabase/cookie";

export async function getService(service_id: string) {
    const supabase = await getDbOnSever();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user || !user.role) {
		console.log("user role not found");
		return;
	}

    const query = await getTablePermissionForSpecificRows(user.role, "Service", [
		"title",
        "image",
        "family_name",
        "buying_price_ht",
        "selling_price_ht",
        "tva",
        "buying_price_ttc",
        "selling_price_ttc",
        "units"
	]);

    const { data: service, error: error } = await supabase
        .from("Service")
        .select(query)
        .eq("uid", service_id)
        .single();
        if (error) {
            console.error("error", error);
            return null;
        }
        const newSer = service as any;
    if (newSer) {
        return {
            image: newSer.image,
            title: newSer.title,
            family: newSer.family_name,
            buying_price_ht: newSer.buying_price_ht,
            selling_price_ht: newSer.selling_price_ht,
            tva: newSer.tva,
            buying_price_ttc: newSer.buying_price_ttc,
            selling_price_ttc: newSer.selling_price_ttc,
            units: newSer.units,
        };
    }
}
interface Service {
    uid?: string;
    image: string;
    title: string;
    family: string;
    buying_price_ht: number;
    selling_price_ht: number;
    tva: number;
    buying_price_ttc: number;
    selling_price_ttc: number;
    units: string;
    reference?: string;
    department_id?: string;
    created_at?: string;
    updated_at?: string;
  };


const EditServiceServer = async (serviceId:string,service:Service) => {
    const supabase = await getDbOnSever();
    const {error} = await supabase.from("Service").update(
        {
            title: service.title,
            image: service.image,
            buying_price_ht: service.buying_price_ht,
            selling_price_ht: service.selling_price_ht,
            buying_price_ttc: service.buying_price_ttc,
            selling_price_ttc: service.selling_price_ttc,
            units: service.units,
            tva: service.tva,
            family_name: service.family,
        }
    ).eq("uid", serviceId);
    if (error) {
        console.error("error", error);
        return error;
    }
    return null;
}

export { EditServiceServer };