"use client";
import {
  Autocomplete,
  Grid,
  TextField,
  TextFieldVariants,
} from "@mui/material";
import React from "react";

export function TabSelect({
  default: defaultValue = null,
  label,
  itemsList,
  variant,
  placeholder,
  onSelect,
  required=true,
}: {
  default?: string | null;
  label?: string;
  itemsList: string[];
  variant?: TextFieldVariants;
  placeholder?: string;
  onSelect: (value: string | null) => void;
  required?: boolean;
}) {
  const [value, setValue] = React.useState<string | null>(defaultValue);
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
            marginTop: "8px",
            marginBottom: "0px",
          },
        }}
        selectOnFocus={true}
        defaultValue={defaultValue}
        value={value}
        options={itemsList}
        fullWidth
        onChange={(event, value) => {
          onSelect(value);
          setValue(value);
        }}
        renderInput={(params) => (
          <TextField
            label={label}
            {...params}
            InputLabelProps={{ required: required }}
            variant={variant ? variant : "outlined"}
            placeholder={placeholder}
          />
        )}
      />
    </Grid>
  );
}