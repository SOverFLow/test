import * as React from 'react';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';

export default function BasicDateTimeRangePicker() {
  const [value, setValue] = React.useState<any>([null, null]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" gap={2}>
        <DateTimePicker
          label="Check-in"
          value={value[0]}
          onChange={(newValue : any) => {
            setValue([newValue, value[1]]);
          }}
        />
        <DateTimePicker
          label="Check-out"
          value={value[1]}
          onChange={(newValue:any) => {
            setValue([value[0], newValue]);
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
