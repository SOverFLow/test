import React from "react";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import { Grid, TextField } from "@mui/material";
import { useTranslations } from "next-intl";

interface HourPriceInputProps {
  startTime?: string;
  endTime?: string;
  pricePlaceholder?: string;
  priceValue?: string;
  onStartTimeChange?: (value: dayjs.Dayjs | null) => void;
  onEndTimeChange?: (value: dayjs.Dayjs | null) => void;
  onPriceChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const format = "HH:mm";

const HourPriceInput: React.FC<HourPriceInputProps> = ({
  startTime,
  endTime,
  pricePlaceholder,
  priceValue = "",
  onStartTimeChange,
  onEndTimeChange,
  onPriceChange,
}) => {
  return (
    <Grid
      sx={{
        my: 0.5,
        gap: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: 38,
      }}
    >
      <TimePicker
        value={dayjs(startTime, format)}
        format={format}
        style={{ height: 38 }}
        onChange={onStartTimeChange}
      />
      <TimePicker
        value={dayjs(endTime, format)}
        format={format}
        style={{ height: 38 }}
        onChange={onEndTimeChange}
      />
      <TextField
        // type="number"
        placeholder={pricePlaceholder}
        value={priceValue}
        onChange={onPriceChange}
        sx={{
          ml: 1,
          "& .MuiInputBase-root": {
            backgroundColor: "white",
            height: 38,
          },
          "& input::placeholder": {
            fontSize: 14,
          },
          my: 0,
          width: 200,
        }}
      />
    </Grid>
  );
};

export default HourPriceInput;
