import { createClient } from "@/utils/supabase/client";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";
import getTablePermissions from "@/utils/fetchingWithRole/getTablePermissions";
import SellingPrice from "../../tasks/components/SellingPrice";
const supabase = createClient();

interface Service {
	uid: string;
	title: string;
	reference?: string;
	bien_id?: string;
	client_id: string;
	price_ttc: number;
}

interface ContractService {
	service_id: string;
	Service?: Service; // Assuming this is the nested structure
}

// export async function getServices(contract_id: string) {
// 	const {
// 		data: { user },
// 	} = await supabase.auth.getUser();
// 	if (!user || !user.role) {
// 		console.log("user role not found");
// 		return;
// 	}

// 	const query = await getTablePermissions(user.role, "contract_service", "service_id", [
// 		{
// 			tableName: "Service",
// 			// @ts-ignore
// 			rows: [
// 				"uid",
// 				"title",
// 				"reference",
// 				"bien_id",
// 				"client_id",
// 				"price_ttc",
// 				{
// 					tableName: "CatalogService",
// 					rows: ["units"],
// 				},
// 				{
// 					tableName: "Client",
// 					rows: ["first_name", "last_name"],
// 				},
// 				{
// 					tableName: "Bien",
// 					rows: ["name"],
// 				},
// 			],
// 		},
// 	]);

// 	console.log("query: ", query);
// 	// const query = await getTablePer
// 	const { data: ServiceData, error } = await supabase
// 		.from("contract_service")
// 		.select(query)
// 		.eq("contract_id", contract_id);

// 	if (error) {
// 		console.error("Error:", error);
// 		return;
// 	}
// 	if (ServiceData) {
// 		const services = ServiceData.map((service: any) => {
// 			console.log("Map service: ", service);
// 			return {
// 				uid: (service as { service_id?: string }).service_id ?? "",
// 				title: service.Service?.title ?? "",
// 				selling_price: service.Service?.price_ttc ?? "",
// 				units: service.Service?.CatalogService?.units ?? "",
// 				client:
// 					`${service.Service?.Client?.first_name} ${service.Service?.Client?.last_name}` ?? "",
// 				bien: service.Service?.Bien?.name ?? "",
// 			};
// 		});
// 		return services;
// 	}

// 	return [];
// }

export async function getServiceByDepartment(department_id: string) {
	if (!department_id) {
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

	const query = await getTablePermissionForSpecificRows(user.role, "Service", ["uid", "title"]);

	const { data, error } = await supabase
		.from("Service")
		.select(query)
		.eq("department_id", department_id);

	if (data) {
		const services = data.map((service: any) => {
			return {
				uid: service.uid,
				title: service.title,
			};
		});
		return services;
	}
	console.error("Service Error:", error);
	return [];
}

export async function getServicesByContract(contract_id: string) {
	if (!contract_id) {
		console.log("Contract not found");
		return;
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user || !user.role) {
		console.log("user role not found");
		return;
	}
	const query = await getTablePermissions(user.role, "contract_service", "service_id", [
		{
			tableName: "Service",
			// @ts-ignore
			rows: ["uid", "title"],
		},
	]);

	const { data, error } = await supabase
		.from("contract_service")
		.select(query)
		.eq("contract_id", contract_id);

	if (data) {
		const services = data.map((service: any) => {
			console.log("=========================================SErvice", service.Service.title);
			return {
				// uid: service.uid,
				title: service.Service.title,
			};
		});
		return services;
	}
	console.error("Service Error:", error);
	return [];
}
