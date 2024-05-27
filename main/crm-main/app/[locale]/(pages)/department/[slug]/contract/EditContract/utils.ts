import { createClient } from "@/utils/supabase/client";
import { Description, Discount } from "@mui/icons-material";
import { title } from "process";

const supabase = createClient();

export async function getContract(client_id: number | string) {
	const { data: contract, error: error } = await supabase
		.from("Contract")
		.select("*")
		.eq("uid", client_id)
		.single();
	if (contract) {
		return {
			start_date: contract.start_date ?? "",
			end_date: contract.end_date ?? "",
			description: contract.description ?? "",
			name: contract.name ?? "",
		};
	}
}

export async function getService(contactId: string) {
	const { data, error } = await supabase
		.from("contract_service")
		.select("service_id")
		.eq("contract_id", contactId);

	if (data) {
		const { data: serviceData, error: serviceError } = await supabase
			.from("Service")
			.select("*")
			.in(
				"uid",
				data?.map((service: any) => service.service_id)
			);

		if (serviceError) {
			console.error("serviceError: ", serviceError);
		}
		if (serviceData) {
			const Services = serviceData.map((service: any) => {
				return {
					uid: service.uid ?? "",
					title: service.title ?? "",
					selling_price: service.selling_price ?? "",
					units: service.units ?? "",
				};
			});
			// console.log("Services: ", Services);
			return Services;
		}
		return [];
	}
}
