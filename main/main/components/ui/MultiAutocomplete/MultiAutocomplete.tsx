import React, { useEffect, useState } from "react";
import {
  MenuItem,
  Autocomplete,
  TextField,
  TextFieldVariants,
  Chip,
  Box,
  InputAdornment,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { styled } from "@mui/material/styles";
import Image from "next/image";

interface MultiAutocompleteProps {
  names: any[];
  label: string;
  placeholder: string;
  onSelectedValuesChange: (
    selectedValues: {
      name: string;
      image: string;
      uid: string;
    }[]
  ) => void;
  defaultValue?: any[];
  variant?: TextFieldVariants;
}

export const MultiAutocomplete = ({
  names,
  label,
  placeholder,
  onSelectedValuesChange,
  defaultValue = [], // Default to an empty array if no defaultValue is provided
  variant,
}: MultiAutocompleteProps) => {
  const [selectedValues, setSelectedValues] = useState<any[]>(
    defaultValue || []
  );

  useEffect(() => {
    if (defaultValue) {
      setSelectedValues(defaultValue);
    } else {
      setSelectedValues([]);
    }
  }, [defaultValue]);

  const handleChange = (
    event: any,
    newValues: any[]
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
      value={selectedValues}
      defaultValue={defaultValue}
      onChange={handleChange}
      disableCloseOnSelect
      autoFocus={false}
      renderOption={(props, option, { selected }) => (
        <ImageMenuItem {...props} key={option.uid}>
          <>
            <Image
              src={option.image ? option.image : "/images/product.png"}
              alt={option.name}
              width={24}
              height={24}
            />
            {option.name}
            {selected && <CheckIcon color="info" />}
          </>
        </ImageMenuItem>
      )}
      renderTags={(tagValue, getTagProps) => {
        return tagValue.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option.uid} // Use uid for unique key
            label={option.name}
          />
        ));
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant={variant || "outlined"}
          placeholder={placeholder}
        />
      )}
    />
  );
};
