import { createClient } from "@/utils/supabase/client";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";

export async function getBienByClient(client_id: string) {
    console.log("---------------Bien");
	const supabase = createClient();
	if (!client_id) {
		console.log("client_id not found");
		return;
	}
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user || !user.role) {
		console.log("user role not found");
		return;
	}

	const query = await getTablePermissionForSpecificRows(user.role, "Bien", ["uid", "name"]);
	console.log("client_id", client_id);
	console.log(" -----------------Bien     query: ", query);
	const { data, error } = await supabase.from("Bien").select(query).eq("client_id", client_id);
	if (data) {
		const biens = data.map((bien: any) => {
			return {
				uid: bien.uid,
				name: bien.name,
			};
		});
		return biens;
	}
	console.error("Bien Error:", error);
	return [];
}
