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
  workers: any[];
  label: string;
  placeholder: string;
  onSelectedValuesChange: (selectedValues: any[]) => void;
  defaultValue?: any[];
  variant?: TextFieldVariants;
  disabled?: boolean;
}

export const MultiAutocompleteWorkers = ({
  workers,
  label,
  placeholder,
  onSelectedValuesChange,
  defaultValue,
  variant,
  disabled,
}: MultiAutocompleteProps) => {
  const [selectedValues, setSelectedValues] = useState<any[]>(
    defaultValue || []
  );
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    if (defaultValue) {
      setSelectedValues(defaultValue);
    } else {
      setSelectedValues([]);
    }
  }, [defaultValue]);

  useEffect(() => {
    setOptions(workers);
  }, [workers]);

  const handleChange = (event: any, newValues: any[]) => {
    const currentUids = selectedValues.map(item => item.uid);
    const newSelection = newValues.filter(value => !currentUids.includes(value.uid));
    const removedSelectionUids = selectedValues
        .filter(value => !newValues.some(newValue => newValue.uid === value.uid))
        .map(item => item.uid);
    const updatedValues = [
        ...selectedValues.filter(value => !removedSelectionUids.includes(value.uid)),
        ...newSelection
    ];

    setSelectedValues(updatedValues);
    onSelectedValuesChange(updatedValues);
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
      options={options}
      getOptionLabel={(option) => `${option?.first_name}  ${option?.last_name}`}
      value={selectedValues}
      onChange={handleChange}
      disableCloseOnSelect
      autoFocus={false}
      renderOption={(props, option) => {
        const isSelected = selectedValues.some(
          (value: any) => value.uid === option.uid
        );
        return (
          <ImageMenuItem {...props} key={option.uid} selected={isSelected}>
            <>
              <Image
                src={option?.avatar ? option?.avatar : "/images/product.png"}
                alt={`${option?.first_name} ${option?.last_name}`}
                width={24}
                height={24}
              />
              {option?.first_name + " " + option?.last_name}
              {isSelected ? <CheckIcon fontSize="small" /> : null}
            </>
          </ImageMenuItem>
        );
      }}
      renderTags={(tagValue, getTagProps) => {
        return tagValue.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option?.uid}
            label={`${option?.first_name} ${option?.last_name}`}
          />
        ));
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant={variant || "outlined"}
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
};
