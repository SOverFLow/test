import React, { useState } from "react";
import {
  MenuItem,
  Autocomplete,
  TextField,
  Chip,
  Box,
  InputAdornment,
  TextFieldVariants,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { styled } from "@mui/material/styles";
import Image from "next/image";

interface Product {
  name: string;
  image: string;
  quantity: number;
}

interface MultiAutocompleteProps {
  names: Product[];
  label: string;
  placeholder: string;
  onSelectedValuesChange: (selectedValues: Product[]) => void;
  defaultValue?: any[];
  variant?: TextFieldVariants;
}

export const MultiAutocompleteProd = ({
  names,
  label,
  placeholder,
  onSelectedValuesChange,
  defaultValue = [],
  variant,
}: MultiAutocompleteProps) => {
  const [selectedValues, setSelectedValues] = useState(defaultValue);

  const handleChange = (
    event: any,
    newValues: Product[]
  ) => {
    setSelectedValues(newValues);
    onSelectedValuesChange(newValues);
  };

  const handleQuantityChange = (name: string, quantity: number) => {
    const newValues = selectedValues.map(item =>
      item.name === name ? { ...item, quantity: quantity } : item
    );
    setSelectedValues(newValues);
    onSelectedValuesChange(newValues);
  };

  const ImageMenuItem = styled(MenuItem)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      margin-right: 10px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    input {
      width: 60px;
      margin-left: 10px;
    }
  `;

  return (
    <Autocomplete
      multiple
      id="multi-autocomplete"
      options={names}
      getOptionLabel={(option) => option.name}
      value={selectedValues}
      onChange={handleChange}
      disableCloseOnSelect
      renderOption={(props, option, { selected }) => (
        <ImageMenuItem {...props} key={option.name}>
          <Image
            src={option.image}
            alt={option.name}
            width={24}
            height={24}
          />
          {option.name}
          <TextField
            size="small"
            type="number"
            defaultValue={option.quantity}
            onChange={(e) => handleQuantityChange(option.name, parseInt(e.target.value))}
            inputProps={{ min: 1, style: { textAlign: 'center' } }}
            InputProps={{
              endAdornment: <InputAdornment position="end">pcs</InputAdornment>,
            }}
          />
        </ImageMenuItem>
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option.name}
            label={`${option.name} x ${option.quantity}`}
            onDelete={() => {}}
          />
        ))
      }
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
