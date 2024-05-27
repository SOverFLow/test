"use client";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

export default function PasswordInput(props: {
  password: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  name: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <TextField
      name={props.name}
      sx={{
        width: "100%",
        mb: 0,
        borderRadius: "0",
        "& .MuiInputBase-root": { borderRadius: "0" },
      }}
      id={props.name}
      type={showPassword ? "text" : "password"}
      placeholder={props.placeholder}
      autoComplete="current-password"
      value={props.password}
      onChange={props.handleChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="start">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
