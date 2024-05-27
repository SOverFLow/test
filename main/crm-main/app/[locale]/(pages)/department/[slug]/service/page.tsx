import { Box } from "@mui/material";
import ServiceTable from "./ServiceTable";
import CreateService from "./CreateService";

export default async function Service() {
	
	return (
		<>
			<Box width={"100%"} sx={{ display: "flex", justifyContent: "space-between" }}>
				<CreateService />
			</Box>
			<Box>
				<ServiceTable  />
			</Box>
		</>
	);
}
