// import React, { useState } from "react";
// import { Autocomplete, TextField, Chip } from "@mui/material";

// interface Option {
// 	label: string;
// 	uid: string;
// 	avatar?: string;
// }

// interface MultiSelectProps {
// 	options: Option[];
// 	defaultVals?: string[];
// 	onSelect: (values: Option[]) => void;
// 	lable?: string;
// }

// const MultiSelectOption: React.FC<MultiSelectProps> = ({
// 	options,
// 	defaultVals = [],
// 	onSelect,
// 	lable,
// }) => {
// 	const selectAllOption: Option = { label: "Select All", uid: "select-all", avatar: "" };
// 	const [selectedOptions, setSelectedOptions] = useState<Option[]>(
// 		options.filter((option) => defaultVals.includes(option.uid))
// 	);
// 	const [allOptions, setAllOptions] = useState<Option[]>([selectAllOption, ...options]);

// 	const handleOptionChange = (event: React.SyntheticEvent, newValues: Option[]) => {
// 		if (newValues.some((option) => option.uid === "select-all")) {
// 			const allSelected = newValues.length === 1 || newValues.length !== allOptions.length;
// 			setSelectedOptions(allSelected ? allOptions.slice(1) : []);
// 			onSelect(allSelected ? allOptions.slice(1) : []);
// 		} else {
// 			setSelectedOptions(newValues);
// 			onSelect(newValues);
// 		}
// 	};

// 	return (
// 		<Autocomplete
// 			multiple
// 			value={selectedOptions}
// 			onChange={handleOptionChange}
// 			options={allOptions}
// 			getOptionLabel={(option) => option.label}
// 			isOptionEqualToValue={(option, value) => option.uid === value.uid}
// 			sx={{ width: "100%" }}
// 			renderInput={(params) => (
// 				<TextField {...params} variant="outlined" placeholder="Choose options" label={lable} />
// 			)}
// 			renderOption={(props, option) => (
// 				<li {...props} key={option.uid}>
// 					{option.label}
// 				</li>
// 			)}
// 			renderTags={(tagValue, getTagProps) =>
// 				tagValue.map((option, index) => (
// 					<Chip label={option.label} {...getTagProps({ index })} key={option.uid} />
// 				))
// 			}
// 			noOptionsText="No options available"
// 		/>
// 	);
// };

// export default MultiSelectOption;

import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";

interface Option {
	label: string;
	uid: string;
	avatar?: string;
}

interface MultiSelectProps {
	options: Option[];
	defaultVals?: string[];
	onSelect: (values: Option[]) => void;
	lable?: string;
}

const MultiSelectOption: React.FC<MultiSelectProps> = ({
	options,
	defaultVals = [],
	onSelect,
	lable,
}) => {
	const selectAllOption: Option = { label: "Select All", uid: "select-all", avatar: "" };
	const [selectedOptions, setSelectedOptions] = useState<Option[]>(
		options.filter((option) => defaultVals.includes(option.uid))
	);
	const [allOptions, setAllOptions] = useState<Option[]>([selectAllOption, ...options]);

	useEffect(() => {
		setAllOptions([selectAllOption, ...options]);
		setSelectedOptions(options.filter((option) => defaultVals.includes(option.uid)));
	}, [options]);

	const handleOptionChange = (event: React.SyntheticEvent, newValues: Option[]) => {
		if (newValues.some((option) => option.uid === "select-all")) {
			const allSelected = newValues.length === 1 || newValues.length !== allOptions.length;
			setSelectedOptions(allSelected ? allOptions.slice(1) : []);
			onSelect(allSelected ? allOptions.slice(1) : []);
		} else {
			setSelectedOptions(newValues);
			onSelect(newValues);
		}
	};

	return (
		<Autocomplete
			multiple
			value={selectedOptions}
			onChange={handleOptionChange}
			options={allOptions}
			getOptionLabel={(option) => option.label}
			isOptionEqualToValue={(option, value) => option.uid === value.uid}
			sx={{ width: "100%" }}
			renderInput={(params) => (
				<TextField {...params} variant="outlined" placeholder="Choose options" label={lable} />
			)}
			renderOption={(props, option) => (
				<li {...props} key={option.uid}>
					{option.label}
				</li>
			)}
			renderTags={(tagValue, getTagProps) =>
				tagValue.map((option, index) => (
					<Chip label={option.label} {...getTagProps({ index })} key={option.uid} />
				))
			}
			noOptionsText="No options available"
		/>
	);
};

export default MultiSelectOption;
