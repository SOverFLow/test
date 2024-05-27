"use client";
import { Autocomplete, Grid, TextField } from "@mui/material";
import React, { ChangeEvent } from "react";

export function TabSelect(props: {
  isSearch?: boolean;
  default?: string;
  itemsList: string[];
  placeholder?: string;
  onSelect?: (value: string | null) => void;
  onInputChange?: (event: ChangeEvent<{}>, value: string) => void;
}) {
  const [value, setValue] = React.useState<string>(props.default ?? "");
  return (
    <Grid>
      <Autocomplete
        freeSolo={props.isSearch}
        value={value === "" ? props.default : value}
        options={props.itemsList}
        fullWidth
        onInputChange={(event, value) => {
          if (props.onInputChange) {
            props.onInputChange(event, value);
          }
        }}
        onChange={(event, value) => {
          if (props.onSelect) {
            props.onSelect(value);
            setValue(value!);
          }
        }}
        renderInput={(params) => (
          <TextField
            variant="standard"
            {...params}
            sx={{
              borderRadius: 0,
              "& .MuiInputBase-root": {
                borderRadius: 0,
                m: 0,
                px: 1,
                py: 0.5,
              },
            }}
            placeholder={props.placeholder}
          />
        )}
      />
    </Grid>
  );
}
