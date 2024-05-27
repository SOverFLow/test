"use client";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import ReactFlagsSelect from "react-flags-select";
import PhoneInput from "react-phone-input-2";
import { TabSelect } from "./TabSelect";
import CurrencyList from "currency-list";

type SelectItem = {
  label: string;
  value: string;
};
export default function CustomTextInput(props: {
  name: string;
  label?: string;
  value?: string;
  placeholder?: string;
  multiline?: number;
  InputProps?: any;
  selectItems?: SelectItem[];
  type: string;
  handleChange: (event: any) => void;
}) {
  const currenciesList: string[] = [
    "AED",
    "AFN",
    "ALL",
    "AMD",
    "ANG",
    "AOA",
    "ARS",
    "AUD",
    "AWG",
    "AZN",
    "BAM",
    "BBD",
    "BDT",
    "BGN",
    "BHD",
    "BIF",
    "BMD",
    "BND",
    "BOB",
    "BRL",
    "BSD",
    "BTC",
    "BTN",
    "BWP",
    "BYN",
    "BZD",
    "CAD",
    "CDF",
    "CHF",
    "CLF",
    "CLP",
    "CNH",
    "CNY",
    "COP",
    "CRC",
    "CUC",
    "CUP",
    "CVE",
    "CZK",
    "DJF",
    "DKK",
    "DOP",
    "DZD",
    "EGP",
    "ERN",
    "ETB",
    "EUR",
    "FJD",
    "FKP",
    "GBP",
    "GEL",
    "GGP",
    "GHS",
    "GIP",
    "GMD",
    "GNF",
    "GTQ",
    "GYD",
    "HKD",
    "HNL",
    "HRK",
    "HTG",
    "HUF",
    "IDR",
    "ILS",
    "IMP",
    "INR",
    "IQD",
    "IRR",
    "ISK",
    "JEP",
    "JMD",
    "JOD",
    "JPY",
    "KES",
    "KGS",
    "KHR",
    "KMF",
    "KPW",
    "KRW",
    "KWD",
    "KYD",
    "KZT",
    "LAK",
    "LBP",
    "LKR",
    "LRD",
    "LSL",
    "LYD",
    "MAD",
    "MDL",
    "MGA",
    "MKD",
    "MMK",
    "MNT",
    "MOP",
    "MRU",
    "MUR",
    "MVR",
    "MWK",
    "MXN",
    "MYR",
    "MZN",
    "NAD",
    "NGN",
    "NIO",
    "NOK",
    "NPR",
    "NZD",
    "OMR",
    "PAB",
    "PEN",
    "PGK",
    "PHP",
    "PKR",
    "PLN",
    "PYG",
    "QAR",
    "RON",
    "RSD",
    "RUB",
    "RWF",
    "SAR",
    "SBD",
    "SCR",
    "SDG",
    "SEK",
    "SGD",
    "SHP",
    "SLL",
    "SOS",
    "SRD",
    "SSP",
    "STD",
    "STN",
    "SVC",
    "SYP",
    "SZL",
    "THB",
    "TJS",
    "TMT",
    "TND",
    "TOP",
    "TRY",
    "TTD",
    "TWD",
    "TZS",
    "UAH",
    "UGX",
    "USD",
    "UYU",
    "UZS",
    "VEF",
    "VES",
    "VND",
    "VUV",
    "WST",
    "XAF",
    "XAG",
    "XAU",
    "XCD",
    "XDR",
    "XOF",
    "XPD",
    "XPF",
    "XPT",
    "YER",
    "ZAR",
    "ZMW",
    "ZWL",
  ];
  const defaultCurrency = props.value ?? "EUR";
  // {item.name + "(" + item.value + "%)"}

  let mySelectItems: SelectItem[] = props.selectItems ?? [];
  if (props.name === "currency") {
    console.log("CurrencyList:", CurrencyList.get("fdf"));
    mySelectItems = currenciesList.map((item, index) => {
      const currency = CurrencyList.get(item);
      if (currency) {
        return {
          label: currency?.name + " (" + currency?.symbol + ")",
          value: item,
        };
      }
      return { label: item, value: item };
    });
  }
  return props.type === "text" ? (
    // <TextField fullWidth variant="standard" sx={{ m: 0 }} />
    <TextField
      variant={props.multiline ?? 1 > 1 ? "outlined" : "standard"}
      multiline={props.multiline ? true : false}
      minRows={props.multiline ?? 1}
      name={props.name}
      sx={{
        width: "100%",
        m: 0,
        borderRadius: 0,
        "& .MuiInputBase-root": {
          borderRadius: 0,
          backgroundColor: "white",
          px: 1,
        },
      }}
      id={props.name}
      type="text"
      placeholder={props.placeholder}
      value={props.value ?? ""}
      onChange={(e) => props.handleChange(e)}
      InputProps={props.InputProps}
    />
  ) : props.type === "phone" ? (
    <PhoneInput
      placeholder="your company phone number"
      specialLabel=""
      inputStyle={{
        width: "100%",
        border: "none",
        borderBottom: "1px solid " + grey[600],
        height: "2.2rem",
        borderRadius: 0,
      }}
      country={"fr"}
      value={props.value}
      // onChange={props.handleChange}
      onChange={(phone) => props.handleChange(phone)}
    />
  ) : props.type === "country" ? (
    <ReactFlagsSelect
      searchable
      className={"menu-flags-1"}
      selected={props.value ?? "FR"}
      onSelect={(code) => props.handleChange(code)}
      placeholder={props.placeholder}
    />
  ) : props.type === "currency" ? (
    <TabSelect
      default={defaultCurrency}
      // value={props.value }
      itemsList={currenciesList}
      onSelect={(value) => props.handleChange(value ?? "EUR")}
    />
  ) : props.type === "select" ? (
    <FormControl
      fullWidth
      sx={{
        border: "none",
      }}
    >
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={props.value ?? ""}
        onChange={props.handleChange}
        sx={{
          width: "100%",
          border: "none",
          height: "2.2rem",
          borderRadius: 0,
          backgroundColor: "white",
          boxShadow: "none",
          ".MuiOutlinedInput-notchedOutline": { border: 0 },
          "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            border: 0,
          },
          "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              border: 0,
            },
          borderBottom: "1px solid " + grey[600],
        }}
      >
        {mySelectItems.map((item: any, index: number) => (
          <MenuItem key={index} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : (
    <p>world</p>
  );
}
