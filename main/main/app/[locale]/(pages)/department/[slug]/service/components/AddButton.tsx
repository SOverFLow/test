import { Box, Grid } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import theme from "@/styles/theme";
import { CustumButton } from "@/components/ui/Button/CustumButton";

interface CustumButtonProps {
	label: any;
	onClick: () => void;
	style?: React.CSSProperties;
	children?: React.ReactNode;
}

export default function AddButton(props: CustumButtonProps) {
	return (
		<Grid item xs={3} display={"flex"} justifyContent={"center"} alignItems={"end"} sx={props.style}>
			<Box
				sx={{
					height: "100%",
					width: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",

				}}
			>
				<CustumButton
					onClick={() => {
						props.onClick();
					}}
					style={{
						fontSize: "0.7rem",
						fontWeight: 550,
						width: "100%",
						textTransform: "none",
						color: "#fff",
						backgroundColor: theme.palette.primary.main,
						maxHeight: "2.3rem",
					}}
					label={
						<>
							<AddCircleOutlineIcon />
							{props.children}
							{props.label}
						</>
					}
				/>
			</Box>
		</Grid>
	);
}
