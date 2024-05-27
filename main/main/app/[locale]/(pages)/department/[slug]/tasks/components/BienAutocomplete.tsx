import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  bien: any;
  translateObj: any;
  onChange: (value: any) => void;
}

export default function BienAutocomplete(props: Props) {
  const [bien, setBien] = useState<any>([]);

  useEffect(() => {
    // if (!props.bien) return;
    setBien(props.bien);
  }, [props.bien]);

  return (
    <Autocomplete
      id="combo-box-demo"
      options={bien!}
      getOptionLabel={(option: any) => option?.name}
      style={{ width: "100%" }}
      onChange={(event, value) => {
        props.onChange(value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={props.translateObj?.select_property}
          variant="standard"
        />
      )}
    />
  );
}
