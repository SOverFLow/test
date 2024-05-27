import { CircularProgress, FormControl, Grid, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import changeStatus from "./utils/changeStatus";
import { contactStatus } from "../utils/dataUnits";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelectPlaceholder({value}:{value:string} ) {
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<string>(value[0]);
  const t = useTranslations("client");
  const handleChange = (event: SelectChangeEvent) => {
    startTransition(async ()=> {
      await changeStatus(event.target.value,value[1]); 
      setSelected(event.target.value);
    })
  };
  useEffect(() => {
    setSelected(value[0]);
  }, [value]);

  return (
      <FormControl sx={{ width: '100%' }}>
        <Select
          displayEmpty
          input={<OutlinedInput />}
          value={selected}
          MenuProps={MenuProps}
          inputProps={{ 'aria-label': 'Without label' }}
          renderValue={()=>{
            return (
              <Grid item xs={12}>
                {isPending ? 
                <CircularProgress size={20}/>
                :
                <>{selected}</>  
              }
              </Grid>
            );
          }}
          onChange={handleChange}
        >
          {Object.keys(contactStatus).map((name) => {
            return (
            <MenuItem
              key={name}
              value={name}
            >
              {name}
            </MenuItem>
          )}
        )}
        </Select>
      </FormControl>
  );
}
