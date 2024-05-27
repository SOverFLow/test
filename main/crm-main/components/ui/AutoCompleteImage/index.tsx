"use client";
import { Box, TextField, Autocomplete, styled } from "@mui/material";
import { useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";

const StyledAutocomplete = styled(Autocomplete)((theme) => ({
  "& .MuiInputBase-root": {
    width: "100%",
    padding: "4px",
    marginTop: "0px",
    marginBottom: "0px",
  },
  "& .MuiFormControl-root": {
    padding: "0px",
    marginTop: "0px",
    marginBottom: "0px",
  },
}));

interface Item {
  uid: string;
  name: string;
  image: string | null;
}

export default function AutoCompleteImage({
  setSelected,
  selected,
  items,
  onDelete,
}: {
  items: Item[];
  setSelected: (value: string) => void;
  selected: string;
  onDelete: (catalogId: string) => void;
}) {
  const [value, setValue] = useState<Item | null>(null);
  useEffect(() => {
    setValue(items.find((item) => item.uid === selected) || null);
  }, [items, selected]);
  return (
    <StyledAutocomplete
      onChange={(event, newValue: any) => {
        setSelected(newValue?.uid);
      }}
      value={value}
      fullWidth
      options={items}
      autoHighlight
      getOptionLabel={(option: any) => option.name}
      renderOption={(props: any, option: any) => {
        const { key, ...otherProps } = props;
        return (
          <li key={key} {...otherProps}>
            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"space-between"}
            >
              <Box display={"flex"}>
                {option.image ? (
                  <Box
                    component={"img"}
                    loading="lazy"
                    sx={{
                      width: "30px",
                      height: "30px",
                      marginRight: "10px",
                      borderRadius: "50%",
                    }}
                    src={option.image}
                    alt={option.name}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      marginRight: "10px",
                      borderRadius: "50%",
                    }}
                  >
                    <ProductionQuantityLimitsIcon />
                  </Box>
                )}
                {option.name}
              </Box>
              <DeleteOutlineIcon
                color="error"
                onClick={() => onDelete(option.uid)}
              />
            </Box>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a catalog"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password",
          }}
        />
      )}
    />
  );
}
