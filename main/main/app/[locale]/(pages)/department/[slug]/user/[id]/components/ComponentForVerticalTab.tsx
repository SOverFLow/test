import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

const SettingsButton = ({ content }: { content: string }) => {
	return (
		<Box>
			<Typography variant="h6">{content}</Typography>
		</Box>
	);
};

interface TabPanelProps {
	children?: ReactNode;
	index: number;
	value: number;
}

const TabPanel = (props: TabPanelProps) => {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
			style={{ height: "100%" }}
		>
			{value === index && <Box sx={{ height: "100%", p: 3 }}>{children}</Box>}
		</div>
	);
}

export { SettingsButton, TabPanel};