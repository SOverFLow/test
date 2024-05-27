import React, { useState } from "react";
import { Autocomplete, Avatar, Box, TextField } from "@mui/material";

interface Option {
	label: string;
	uid: string;
	avatar?: string;
}

interface SelectOptionProps {
	options: Option[];
	defaultVal?: string;
	onSelect: (value: Option | null) => void;
	lable: string;
	disable?: boolean;
}

const SelectOption: React.FC<SelectOptionProps> = ({
	options,
	defaultVal = "",
	onSelect,
	lable,
	disable = false,
}) => {
	const [selectedOption, setSelectedOption] = useState<Option | null>(
		options.find((option) => option.uid === defaultVal) || null
	);

	const handleOptionChange = (event: React.SyntheticEvent, newValue: Option | null) => {
		setSelectedOption(newValue);
		onSelect(newValue);
	};

	return (
		<Autocomplete
			disabled={disable}
			value={selectedOption}
			onChange={handleOptionChange}
			options={options}
			getOptionLabel={(option) => option.label}
			sx={{ width: "100%" }}
			renderInput={(params) => (
				<TextField {...params} label={lable} placeholder={"Choose an option"} variant="outlined" />
			)}
			renderOption={(props, option) => (
				<li {...props} key={option.uid}>
					{" "}
					<Box display="flex" alignItems="center" key={option.uid}>
						{option.avatar && (
							<Avatar src={option.avatar} sx={{ width: 24, height: 24, marginRight: 1 }} />
						)}
						{option.label}
					</Box>
				</li>
			)}
			isOptionEqualToValue={(option, value) => option.uid === value.uid}
			noOptionsText="No options available"
		/>
	);
};

export default SelectOption;
