"use client";
import { TextField } from "@mui/material";

export default function TextInput(props: {
  value?: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  name: string;
  multiline?: boolean;
  InputProps?: any;
}) {
  return (
    <TextField
      multiline={props.multiline ? true : false}
      minRows={props.multiline ? 3 : 1}
      name={props.name}
      sx={{
        width: "100%",
        my: 1,
        borderRadius: 0,
        "& .MuiInputBase-root": { borderRadius: 0 },
      }}
      id={props.name}
      type="text"
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.handleChange}
      InputProps={props.InputProps}
    />
  );
}
