"use client";
import React, { useEffect, useState } from "react";
import { Autocomplete, Grid, TextField, TextFieldProps } from "@mui/material";

interface OptionType {
	name: string;
	value?: number;
}

interface TabSelectProps {
	label?: string;
	itemsList: OptionType[];
	variant?: TextFieldProps["variant"];
	placeholder?: string;
	onSelect: (value: OptionType[] | null) => void;
	required?: boolean;
	defaultVal?: number | string;
	isFromFamily?: boolean;
}

export default function TabSelectForService({
	label,
	itemsList,
	variant = "outlined",
	placeholder,
	onSelect,
	required = true,
	defaultVal = 0 || '',
	isFromFamily = false,
}: TabSelectProps) {
	let defaultOption:any = null;
	if (typeof defaultVal === "number") {
		defaultOption = itemsList.find(option => option.value === defaultVal);
	}
	if (typeof defaultVal === "string") {
		defaultOption = itemsList.find(option => option.name === defaultVal);
	}
	const [value, setValue] = useState<any>(defaultOption || null);
	useEffect(() => {
		setValue(defaultOption || null);
	}, [defaultOption]);
	return (
		<Grid>
			<Autocomplete
				aria-label="Select a tab"
				sx={{
					"& .MuiInputBase-root": {
						padding: "4px",
						marginTop: "0px",
						marginBottom: "0px",
					},
					"& .MuiFormControl-root": {
						padding: "0px",
						marginTop: "0px",
						marginBottom: "0px",
					},
				}}
				selectOnFocus
				value={value}
				options={itemsList}
				fullWidth
				onChange={(event, newValue: OptionType[] | null) => {
					const selectedValue = newValue || null;
					onSelect(selectedValue);
					setValue(selectedValue);
				}}
				getOptionLabel={(option: any) => option?.name}
				renderOption={(props: any, option: any) => {
					const { key, ...otherProps } = props;
					return (
						<li key={key} {...otherProps}>
							{option.name}{isFromFamily?'':`: ${option.value}%`}
						</li>
					);
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						label={label}
						InputLabelProps={{ required }}
						variant={variant}
						placeholder={placeholder}
					/>
				)}
			/>
		</Grid>
	);
}
