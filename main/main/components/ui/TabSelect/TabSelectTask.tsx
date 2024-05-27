import { createClient } from "@/utils/supabase/client";
import { fetchClients } from "@/utils/supabase/fetchClients";
import CheckIcon from "@mui/icons-material/Check";
import { Autocomplete, Grid, MenuItem, styled, TextField, TextFieldVariants } from "@mui/material";
import Image from "next/image";
import React, { useEffect } from "react";

export function TabSelectTask({
  default: defaultValue,
  label,
  itemsList,
  variant,
  placeholder,
  required = true,
  isClient = false,
  disabled = false,
  departement_id,
  onSelect,
}: {
  departement_id?: string;
  default?: any | null;
  label?: string;
  itemsList: any[];
  variant?: TextFieldVariants;
  placeholder?: string;
  onSelect: (value: any | null) => void;
  required?: boolean;
  isClient?: boolean;
  disabled?: boolean;
}) {
  const supabase = createClient();
  const ImageMenuItem = styled(MenuItem)`
    img {
      margin-right: 10px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
  `;

  const [value, setValue] = React.useState<any>(defaultValue);
  const [options, setOptions] = React.useState<any>(itemsList);

  useEffect(() => {
    if (defaultValue) setValue(defaultValue);
    else setValue(null);
  }, [defaultValue]);

  const handleChange = (event: any, newValues: any) => {
    setValue(newValues);
    onSelect(newValues);
  };

  useEffect(() => {
    setOptions(itemsList);
    console.log("list: ", itemsList);
  }, [itemsList]);

  useEffect(() => {
    if (departement_id) {
      const clientChannel = supabase
        .channel("realtime:client_X")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "client_department",
            filter: "department_id=eq." + departement_id,
          },
          async (payload) => {
            console.log("payload______5145____________", payload);
            if (payload.eventType === "INSERT") {
              const data = await fetchClients(payload.new.client_id);
              console.log("data", data);
              if (data) {
                // setNewClient(data);
                setOptions((prevClients: any) => [...prevClients, data]);
              }
            }
          }
        )
        .subscribe();

      return () => {
        clientChannel.unsubscribe();
      };
    }
  }, [supabase, departement_id]);

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
        defaultValue={defaultValue ? defaultValue.first_name : null}
        value={value ? value.first_name + " " + value.last_name : ""}
        options={options}
        fullWidth
        autoFocus={false}
        onChange={handleChange}
        disabled={disabled}
        renderOption={(props, option, { selected }) => (
          <ImageMenuItem {...props} key={option.uid}>
            <>
              <Image
                src={option.avatar ? option.avatar : "/images/product.png"}
                alt={option.first_name}
                width={24}
                height={24}
              />
              {option.first_name + " " + option.last_name}
              {selected && <CheckIcon color="success" />}
            </>
          </ImageMenuItem>
        )}
        renderInput={(params) => (
          <TextField
            label={label}
            {...params}
            InputLabelProps={{ required: required }}
            variant={variant ? variant : "outlined"}
            placeholder={placeholder}
            autoFocus={false}
          />
        )}
      />
    </Grid>
  );
}
