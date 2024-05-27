import { Grid, MenuItem, TextField, TextFieldVariants } from "@mui/material";
import React, { useState } from "react";
import { NumberFormatBase } from "react-number-format";

const options = [
  {
    locale: "Europe",
    currency: "EUR",
  },
  {
    locale: "en-US",
    currency: "USD",
  },
  {
    locale: "en-GB",
    currency: "GBP",
  },
  {
    locale: "ja-JP",
    currency: "JPY",
  },
  {
    locale: "en-IN",
    currency: "INR",
  },
];

interface CurrencyInputFieldProps {
  onValueChange: (value: string) => void;
  onCurrencyChange: (currencyConfig: {
    locale: string;
    currency: string;
  }) => void;
  label?: string;
  variant?: TextFieldVariants;
}

export const CurrencyInputField: React.FC<CurrencyInputFieldProps> = ({
  onValueChange,
  onCurrencyChange,
  label,
  variant,
}) => {
  const [formattedValue, setFormattedValue] = useState<string | undefined>("0");

  const handleChange = (event: any) => {
    if (event) {
      setFormattedValue(event);
      onValueChange(event);
    }
  };

  const [intlConfig, setIntlConfig] = useState<any>(options[0]);

  const handleIntlSelect = (event: any) => {
    const config = options[Number(event.target.value)];
    if (config) {
      setIntlConfig(config);
      setFormattedValue("0");
      onCurrencyChange(config);
    }
  };

  const format = (numStr: string) => {
    if (numStr === "") return "";
    const num = parseFloat(numStr);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: intlConfig?.currency,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <Grid container>
      {/* <Grid xs={8} item> */}
        <NumberFormatBase
          name="input-1"
          label={label}
          variant={variant ? variant : "outlined"}
          customInput={TextField}
          fullWidth
          margin="dense"
          format={format}
          onValueChange={(values: any) => {
            handleChange(values.formattedValue);
          }}
          value={formattedValue}
        />
      {/* </Grid> */}

      {/* <Grid xs={3.8} sx={{ marginLeft: "6px" }} item>
        <TextField
          select
          margin="dense"
          label={label ? "Currency" : label}
          value={options[0]}
          name="currency"
          onChange={handleIntlSelect}
          variant={variant ? variant : "outlined"}
        >
          {options.map((config, i) => {
            if (config) {
              const { locale, currency } = config;
              return (
                <MenuItem key={`${locale}${currency}`} value={currency}>
                  {currency}
                </MenuItem>
              );
            }
          })}
        </TextField>
      </Grid> */}
    </Grid>
  );
};

export default CurrencyInputField;
