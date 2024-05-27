import {
	CircularProgress,
	FormControl,
	Grid,
	MenuItem,
	OutlinedInput,
	Select,
} from "@mui/material";
import React, { useState, useRef } from "react";
import { getServicesByContract } from "../utils/getService";
import { useTranslations } from "next-intl";
import { Typography } from "antd";

interface GetServicesProps {
	contractId: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

export default function GetServices({ contractId }: GetServicesProps) {
	const [services, setServices] = useState<any>();
	const [isLoading, setIsLoading] = useState(false);

	const fetchServices = async () => {
		setIsLoading(true);
		try {
			const data = await getServicesByContract(contractId);
			setServices(data);
			console.log("Fetched data: ", data);
		} catch (error) {
			console.error("Error fetching services: ", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<FormControl sx={{ width: "100%" }}>
			<Select
				displayEmpty
				input={<OutlinedInput />}
				value={"All services"}
				onOpen={fetchServices} // Fetch data when Select is opened
				MenuProps={MenuProps}
				inputProps={{ "aria-label": "Without label" }}
				renderValue={() => <Typography>{"All services"}</Typography>}
			>
				{services ? (
					services.map((service: any) => (
						<MenuItem key={service.id} value={service.title}>
							{service.title}
						</MenuItem>
					))
				) : (
					<Grid container justifyContent="center" alignItems="center">
						<Grid item>
							<CircularProgress size={20} />
						</Grid>
					</Grid>
				)}
			</Select>
		</FormControl>
	);
}
