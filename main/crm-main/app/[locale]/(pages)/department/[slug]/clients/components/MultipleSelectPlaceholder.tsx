import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import fetchBienData from "../utils/fetchContarctBienData";
import { useEffect, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Grid, MenuItem } from '@mui/material';

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

export function MultipleSelectPlaceholder({clientId,table}:{clientId:any,table:"Bien"|"Contract"} ) {
    const [bienData, setBienData] = useState<string[]>([table]);
    const [isPending, startTransition] = useTransition();
    const t = useTranslations("client");
    
    useEffect(() => {
      if (!clientId) return;
      startTransition(async ()=> {
        const getBienData = await fetchBienData(clientId,table);
        console.log('fd',getBienData,table);
        setBienData(()=>[table,...getBienData]);
      })
    });
  
    return (
        <FormControl sx={{ width: '100%' }}>
          <Select
            displayEmpty
            input={<OutlinedInput />}
            defaultValue={t('click-to-see-all')}
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Without label' }}
            renderValue={()=>{
              return (
                <Grid item xs={12}>
                  {t('click-to-see-all')}
                </Grid>
              );
            }}
          >
            {bienData.map((name) => {
              let index = 0;
              if (name === table)
                index = 1;
              return (
              <MenuItem
                key={name}
                value={name}
                disabled={index === 1 ? true : false}
              >
                {name}
              </MenuItem>
            )}
          )}
          </Select>
        </FormControl>
    );
  }