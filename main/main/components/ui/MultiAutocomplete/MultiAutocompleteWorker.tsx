import React, { useState } from "react";
import { MenuItem, Autocomplete, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { styled } from "@mui/material/styles";
import Image from "next/image";

interface MultiAutocompleteWorkerProps {
  names: { name: string; image: string }[];
  label: string;
  placeholder: string;
  onSelectedValuesChange: (
    selectedValues: { name: string; image: string }[]
  ) => void;
  defaultValue?: { name: string; image: string }[];
}

export const MultiAutocompleteWorker = ({
  names,
  label,
  placeholder,
  onSelectedValuesChange,
  defaultValue,
}: MultiAutocompleteWorkerProps) => {
  const [selectedValues, setSelectedValues] =
    useState<{ name: string; image: string }[]>();
  const handleChange = (
    event: any,
    newValues: { name: string; image: string }[]
  ) => {
    setSelectedValues(newValues);
    onSelectedValuesChange(newValues);
  };

  const ImageMenuItem = styled(MenuItem)`
    img {
      margin-right: 10px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
  `;

  return (
    <Autocomplete
      multiple
      id="tags-standard"
      options={names}
      getOptionLabel={(option) => option.name}
      defaultValue={defaultValue}
      onChange={handleChange}
      disableCloseOnSelect
      renderOption={(props, option, { selected }) => (
        <ImageMenuItem
          key={option.name}
          value={option.name}
          sx={{ justifyContent: "space-between" }}
          {...props}
        >
          <Image
            src={option.image ? option.image : "/images/product.png"}
            alt={option.name}
            width={24}
            height={24}
          />
          {option.name}
          {selected ? <CheckIcon color="info" /> : null}
        </ImageMenuItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
};
