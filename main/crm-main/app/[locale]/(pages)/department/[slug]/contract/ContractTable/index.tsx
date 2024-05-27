"use client";
import { Box, Theme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import EditContract from "../EditContract";
import DeleteContract from "../DeletContract";
import { useTranslations } from "next-intl";
import GetServices from "../components/GetServices";
import { fetchServerContract } from "../utils/fetchContract";
import { useParams } from "next/navigation";

export default function ContractTable({ ContractData }: { ContractData: any }) {
	const t = useTranslations("Contract");
	const { slug } = useParams();
	const [isPending, startTransition] = useTransition();
	const [rowsData, setRowsData] = useState(
		ContractData.map((contract: any, index: number) => ({
			id: contract.uid,
			col1: contract.reference,
			col2: contract.name,
			col4: contract.uid,
			col5: contract.bien,
			col6: contract.uid,
		}))
	);
	console.log("rowsData: ", rowsData);
	const columns: GridColDef[] = [
		{ field: "col1", headerName: "reference", width: 200, type: "string" },
		{ field: "col2", headerName: "clien-name", width: 200, type: "string" },
		{
			field: "col4",
			headerName: "services",
			width: 250,
			type: "string",
			renderCell: (params: any) => {
				return <GetServices contractId={params.value as string} />;
			},
		},

		{ field: "col5", headerName: "biens", width: 250, type: "string" },
		{
			field: "col6",
			headerName: `${t("Actions")}`,
			width: 250,
			renderCell: (params: any) => (
				<>
					<EditContract contractId={params.value as string} />
					<DeleteContract contractId={params.value} />
				</>
			),
		},
	];

	const supabase = createClient();

	useEffect(() => {
		const contractChanel = supabase
			.channel("ContractChanel")
			.on("postgres_changes", { event: "*", schema: "public", table: "Contract" }, (payload) => {
				if (payload.eventType === "DELETE") {
					setRowsData((prevData: any) => {
						return prevData.filter((row: any) => row.id !== payload.old.uid);
					});
				} else if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
					startTransition(async () => {
						const ContractData = await fetchServerContract(slug as string);
						setRowsData(
							ContractData.map((contract: any, index: number) => ({
								id: contract.uid,
								col1: contract.reference,
								col2: contract.name,
								// col4: contract.service,
								col5: contract.bien,
								col6: contract.uid,
							}))
						);
					});
					// setRowsData((prevData: any) => [
					// ...prevData,
					// {
					// 	id: payload.new.uid,
					// 	col1: payload.new.reference,
					// 	// col2: payload.new.name,
					// 	col3: payload.new.discount,
					// 	// col4: payload.new.end_date,
					// 	// col5: payload.new.bien,
					// 	col6: payload.new.uid,
					// },
					// ]);
				}
				// else if (payload.eventType === "UPDATE") {
				// 	setRowsData((prevData: any) => {
				// 		return prevData.map((row: any) => {
				// 			if (row.id === payload.new.uid) {
				// 				return {
				// 					...row,
				// 					id: payload.new.uid,
				// 					col1: payload.new.reference,
				// 					// col2: payload.new.description,
				// 					col3: payload.new.discount,
				// 					// col4: payload.new.end_date,
				// 					// col5: payload.new.bien,
				// 					col6: payload.new.uid,
				// 				};
				// 			}
				// 			return row;
				// 		});
				// 	});
				// }
			})
			.subscribe();

		return () => {
			contractChanel.unsubscribe();
		};
	});

	return (
		<Box mt={3} sx={{ width: "100%", height: "calc(100vh - 200px)" }}>
			<DataGrid
				columns={columns}
				rows={rowsData}
				rowHeight={40}
				initialState={{
					pagination: { paginationModel: { pageSize: 25 } },
				}}
				pageSizeOptions={[25, 50, 100]}
				sx={{
					"& .MuiDataGrid-columnHeaders": {
						bgcolor: (theme: Theme) => theme.palette.primary.dark,
						color: (theme: Theme) => theme.palette.grey[100],
					},
					"& .MuiDataGrid-row": {
						bgcolor: (theme: Theme) => theme.palette.grey[100],
						"&:nth-of-type(even)": {
							bgcolor: (theme: Theme) => theme.palette.grey[300],
						},
						"&:hover": {
							bgcolor: (theme: Theme) => theme.palette.primary.light,
						},
					},
				}}
			/>
		</Box>
	);
}
