"use server";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import getTablePermissions from "@/utils/fetchingWithRole/getTablePermissions";
import { getDbOnSever } from "@/utils/supabase/cookie";

export async function fetchServerContract(department_id: string): Promise<any | undefined> {
	const supabase = await getDbOnSever();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user || !user.role) {
		console.log("user role not found");
		return;
	}

	const query = await getTablePermissions(user.role, "Contract", "reference, discount, uid", [
		{
			tableName: "Bien",
			// @ts-ignore
			rows: ["uid", "name"],
		},
		{
			tableName: "Client",
			// @ts-ignore
			rows: ["uid", "first_name", "last_name"],
		},
	]);

	const { data, error } = await supabase
		.from("Contract")
		.select(query)
		.eq("department_id", department_id);

	if (error) {
		console.error("errore: ", error);
		return;
	}

	const Contracts = data.map((contract: any) => {
		return {
			uid: contract.uid,
			name: (contract.Client?.first_name || "") + " " + (contract.Client?.last_name || ""),
			reference: contract.reference,
			discount: contract.discount,
			bien: contract.Bien?.name,
			// terms: contract.terms,
			// department_id: contract.department_id,
		};
	});
	console.log("Contracts: ", Contracts);

	return Contracts;
}
