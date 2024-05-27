"use client";
import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Grid,
  TextField,
  TextFieldProps,
} from "@mui/material";

interface OptionType {
  uid: string;
  name: string;
}

interface TabSelectProps {
  initialValue?: OptionType;
  label?: string;
  itemsList: OptionType[];
  variant?: TextFieldProps["variant"];
  placeholder?: string;
  onSelect: (value: OptionType[] | null) => void;
  required?: boolean;
}

export default function MyTabSelect({
  initialValue,
  label,
  itemsList,
  variant = "outlined",
  placeholder,
  onSelect,
  required = true,
}: TabSelectProps) {
  // const [value, setValue] = useState<any>(initialValue);
  useEffect(() => {
    console.log("initialValue", initialValue); 
  }, [initialValue]);
  return (
    <Grid width={"100%"}>
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
            marginTop: "8px",
            marginBottom: "0px",
          },
        }}
        selectOnFocus
        value={initialValue}
        options={itemsList}
        fullWidth
        onChange={(event, newValue: OptionType[] | null) => {
          const selectedValue = newValue || null;
          onSelect(selectedValue);
          // setValue(selectedValue);
        }}
        getOptionLabel={(option: any) => option?.name}
        renderOption={(props: any, option: any) => {
          const { key, ...otherProps } = props;
          return (
            <li key={key} {...otherProps}>
              {option?.name}
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
