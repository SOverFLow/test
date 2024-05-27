// 'use client';
import { Box } from "@mui/material";
import { fetchServerContract } from "./utils/fetchContract";
import CreateContract from "./CreateContract";
import ContractTable from "./ContractTable";

export default async function Contract({ params }: { params: { slug: string } }) {
	const ContractData = await fetchServerContract(params.slug);
	return (
		<>
			<Box>
				{/* {ContractData}  */}
			</Box>
			<Box width={"100%"} sx={{ display: "flex", justifyContent: "space-between" }}>
				<CreateContract />
			</Box>

			<Box><ContractTable ContractData={ContractData || []} /></Box>
		</>
	);
}
