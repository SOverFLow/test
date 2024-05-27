'use server';
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import { getDbOnSever } from "@/utils/supabase/cookie";

export async function fetchServerService(department_id: string): Promise<any | undefined> {
	if (!department_id) {
		console.error("department_id not found");
		return;
	}
	const supabase = await getDbOnSever();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user || !user.role) {
		console.log("user role not found");
		return;
	}

	const query = await getTablePermissionForSpecificRows(user.role, "Service", [
		"uid",
		"image",
		"title",
		"family_name",
		"buying_price_ht",
		"selling_price_ht",
		"tva",
		"buying_price_ttc",
		"selling_price_ttc",
		"units",
		"reference",
		"department_id",
		"created_at",
		"updated_at",
	]);
	const { data, error } = await supabase
		.from("Service")
		.select(`${query}`)
		.eq("department_id", department_id);

	if (error) {
		console.error("errore: ", error);
		return;
	}
	const Service = data.map((service: any) => {
		return {
			uid: service.uid,
			image: service.image,
			title: service.title,
			family: service.family_name,
			buying_price_ht: service.buying_price_ht,
			selling_price_ht: service.selling_price_ht,
			tva: service.tva,
			buying_price_ttc: service.buying_price_ttc,
			selling_price_ttc: service.selling_price_ttc,
			units: service.units,
			reference: service.reference,
			department_id: service.department_id,
			created_at: service.created_at,
			updated_at: service.updated_at,
		};
	});
	return Service;
};

export async function fetchServerOneService(service_id:string) {
	if (!service_id) {
		console.error("service_id not found");
		return;
	}
	const supabase = await getDbOnSever();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user || !user.role) {
		console.log("user role not found");
		return;
	}

	const query = await getTablePermissionForSpecificRows(user.role, "Service", [
		"uid",
		"image",
		"title",
		"family_name",
		"buying_price_ht",
		"selling_price_ht",
		"tva",
		"buying_price_ttc",
		"selling_price_ttc",
		"units",
		"reference",
		"department_id",
		"created_at",
		"updated_at",
	]);
	
	const { data, error } = await supabase
		.from("Service")
		.select(`${query}`)
		.eq('uid', service_id)

	if (error) {
		console.error("errore: ", error);
		return;
	}

	const Service = data.map((service: any) => {
		return {
			uid: service.uid,
			image: service.image,
			title: service.title,
			family: service.family_name,
			buying_price_ht: service.buying_price_ht,
			selling_price_ht: service.selling_price_ht,
			tva: service.tva,
			buying_price_ttc: service.buying_price_ttc,
			selling_price_ttc: service.selling_price_ttc,
			units: service.units,
			reference: service.reference,
			department_id: service.department_id,
			created_at: service.created_at,
			updated_at: service.updated_at,
		};
	});
	return Service[0];
};

