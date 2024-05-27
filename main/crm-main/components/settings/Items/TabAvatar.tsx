"use client";
import React, { useEffect, useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/Edit";
import { Grid } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { grey } from "@mui/material/colors";
import { VisuallyHiddenInput } from "./visuallyHiddenInput";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";

export default function TabAvatar(props: {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imgUrl: string | null;
  name: string;
}) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const handleButtonClick = () => {
    // Programmatically trigger a click event on the hidden input
    if (hiddenInputRef.current) {
      hiddenInputRef.current.click();
    }
  };

  return (
    <Grid
      onClick={handleButtonClick}
      style={{
        position: "relative",
        display: "inline-block",
        cursor: "pointer",
      }}
    >
      {props.imgUrl ? (
        <Avatar
          alt="Remy Sharp"
          src={props.imgUrl!}
          sx={{ width: 100, height: 100 }}
        />
      ) : (
        <BusinessOutlinedIcon
          sx={{ width: 100, height: 100, color: grey[500] }}
        />
      )}

      <IconButton
        sx={{
          position: "absolute",
          bottom: "0%",
          right: "0%",
          transform: "translate(50%, -50%)",
          backgroundColor: "#f2f2f2",
          "&:hover": {
            backgroundColor: "#e6e6e6",
          },
        }}
      >
        <VisuallyHiddenInput
          id={props.name}
          name={props.name}
          type="file"
          ref={hiddenInputRef}
          onChange={props.handleChange}
          required
        />
        <PhotoCamera />
      </IconButton>
    </Grid>
  );
}
