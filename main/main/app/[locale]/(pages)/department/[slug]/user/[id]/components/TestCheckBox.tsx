import { FormControlLabel, Switch, styled } from "@mui/material";

const StyledSwitch = styled(Switch)(({ theme }) => ({
	padding: 8,
	"& .MuiSwitch-track": {
		borderRadius: 22 / 2,
		"&::before, &::after": {
			content: '""',
			position: "absolute",
			top: "50%",
			transform: "translateY(-50%)",
			width: 16,
			height: 16,
		},
		"&::before": {
			left: 12,
		},
		"&::after": {
			right: 12,
		},
	},
	"& .MuiSwitch-thumb": {
		boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.2)",
		width: 16,
		height: 16,
		margin: 2,
	},
}));

const TestCheckBox = ({
	label,
	checked,
	onChange,
}: {
	label: React.ReactNode;
	checked: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Adjust this type if necessary
}) => {
	return (
		<FormControlLabel
			control={<StyledSwitch checked={checked} onChange={onChange} />}
			label={label}
			sx={{ width: "100%" }}
		/>
	);
};

export default TestCheckBox;