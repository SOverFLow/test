import { FormError } from "@/components/ui/FormError/FormError";
import {
  Autocomplete,
  Box,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";

interface SupplierDetailsProps {
  newSupplierData: any;
  setNewSupplierData: (data: any) => void;
  SupplierErrors: any;
}

const SupplierDetails: React.FC<SupplierDetailsProps> = ({
  newSupplierData,
  setNewSupplierData,
  SupplierErrors,
}) => {
  const t = useTranslations("Supplier");
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setNewSupplierData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log("----SupplierErrors: ", SupplierErrors);
    console.log("----newSupplierData: ", newSupplierData);
  }, [SupplierErrors]);
  const currenciesList = [
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
  return (
    <>
      <Box
        display={"flex"}
        gap={"1rem"}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        <Box width={"100%"}>
          <FormControl fullWidth sx={{ marginTop: 1, gap: "0.5rem" }}>
            {/* <InputLabel id="gender-label">Supplier Type</InputLabel> */}
            <Grid item md={12} xs={12} marginTop={"0.8rem"}>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: "#222222",
                  display: "flex",
                  alignItems: "end",
                }}
              >
                {t("supplier-third-party-type")}
              </Typography>
            </Grid>
            <Select
              // labelId="type-label"
              id="type-select"
              margin="dense"
              fullWidth
              name="supplier_type"
              value={newSupplierData.supplier_type}
              onChange={handleInputChange}
              displayEmpty
              renderValue={
                newSupplierData.supplier_type !== undefined
                  ? undefined
                  : () => "Select type of supplier"
              }
            >
              <MenuItem value="Governmental">{t("governmental")}</MenuItem>
              <MenuItem value="Large company">{t("large-company")}</MenuItem>
              <MenuItem value="Medium company">{t("medium-company")}</MenuItem>
              <MenuItem value="Small company">{t("small-company")}</MenuItem>
              <MenuItem value="Individual">{t("individual")}</MenuItem>
              <MenuItem value="other">{t("other")}</MenuItem>
            </Select>
          </FormControl>
          {SupplierErrors.supplier_type && (
            <FormError error={SupplierErrors.supplier_type} />
          )}
        </Box>
      </Box>

      <Box
        display={"flex"}
        marginTop={"0.8rem"}
        sx={{ flexDirection: "column" }}
      >
        <Box width={"100%"}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
              color: "#222222",
              display: "flex",
              alignItems: "end",
            }}
          >
            {t("product-supplier-category")}
          </Typography>
        </Box>
        <Box width={"100%"}>
          <TextField
            autoFocus={false}
            fullWidth
            placeholder={t("supplier-category")}
            name="supplier_category"
            value={newSupplierData.supplier_category}
            onChange={handleInputChange}
          />
          {SupplierErrors.supplier_category && (
            <FormError error={SupplierErrors.supplier_category} />
          )}
        </Box>
      </Box>

      <Grid item md={12} xs={12} marginTop={"1rem"}>
        <Typography
          sx={{
            fontWeight: 550,
            fontSize: "1.2rem",
            color: "#222222",
            display: "flex",
            alignItems: "end",
          }}
        >
          {t("address-details")}
        </Typography>
        <Divider
          sx={{
            marginTop: "1rem",
            marginBottom: "1rem",
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        />
      </Grid>
      <Box
        display={"flex"}
        sx={{ flexDirection: "column", marginTop: "0.5rem" }}
      >
        <Box width={"100%"}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
              color: "#222222",
              display: "flex",
              alignItems: "end",
            }}
          >
            {t("address-0")}
          </Typography>
        </Box>

        <Box width={"100%"}>
          <TextField
            fullWidth
            placeholder={t("address-0")}
            name="address"
            value={newSupplierData.address}
            onChange={handleInputChange}
          />
          {SupplierErrors.address && (
            <FormError error={SupplierErrors.address} />
          )}
        </Box>

        <Box width={"100%"}>
          <TextField
            fullWidth
            placeholder={t("country-0")}
            name="country"
            value={newSupplierData.country}
            onChange={handleInputChange}
          />
          {SupplierErrors.country && (
            <FormError error={SupplierErrors.country} />
          )}
        </Box>
      </Box>

      <Box
        display={"flex"}
        gap={"1rem"}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        <Box width={"100%"}>
          <TextField
            fullWidth
            placeholder={t("zip-code")}
            name="zip_code"
            value={newSupplierData.zip_code}
            InputLabelProps={{ shrink: true, required: false }}
            onChange={handleInputChange}
          />

          {SupplierErrors.zip_code && (
            <FormError error={SupplierErrors.zip_code} />
          )}
        </Box>

        <Box width={"100%"}>
          <TextField
            fullWidth
            placeholder={t("city")}
            name="city"
            value={newSupplierData.city}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true, required: false }}
          />
          {SupplierErrors.city && <FormError error={SupplierErrors.city} />}
        </Box>
      </Box>
      <Box
        display={"flex"}
        gap={"1rem"}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        <Box width={"100%"}>
          <TextField
            fullWidth
            placeholder={t("state-province")}
            name="state_province"
            value={newSupplierData.state_province}
            InputLabelProps={{ shrink: true, required: false }}
            onChange={handleInputChange}
          />
          {SupplierErrors.state_province && (
            <FormError error={SupplierErrors.state_province} />
          )}
        </Box>

        <Box width={"100%"}>
          <TextField
            fullWidth
            placeholder={t("fax")}
            name="fax"
            value={newSupplierData.fax}
            onChange={handleInputChange}
          />
          {SupplierErrors.fax && <FormError error={SupplierErrors.fax} />}
        </Box>
      </Box>

      <Grid item md={12} xs={12} marginTop={"1rem"}>
        <Typography
          sx={{
            fontWeight: 550,
            fontSize: "1.2rem",
            color: "#222222",
            display: "flex",
            alignItems: "end",
          }}
        >
          {t("more-details")}
        </Typography>
        <Divider
          sx={{
            marginTop: "1rem",
            marginBottom: "1rem",
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        />
      </Grid>

      <Box display={"flex"} sx={{ flexDirection: "column" }}>
        <Box width={"100%"}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
              color: "#222222",
              display: "flex",
              alignItems: "end",
            }}
          >
            {t("currency")}
          </Typography>
        </Box>
        <Box width={"100%"}>
          <Autocomplete
            value={newSupplierData.cuurency}
            options={currenciesList}
            getOptionLabel={(option) => option}
            onChange={(event, value: any) => {
              setNewSupplierData((prevState: any) => ({
                ...prevState,
                cuurency: value,
              }));
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder={t("currency")} />
            )}
          />
          {SupplierErrors.cuurency && (
            <FormError error={SupplierErrors.cuurency} />
          )}
        </Box>
      </Box>

      <Box display={"flex"} sx={{ flexDirection: "column" }}>
        <Box width={"100%"} marginTop={"0.5rem"}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
              color: "#222222",
              display: "flex",
              alignItems: "end",
            }}
          >
            {t("professional-id-if-applicable")}
          </Typography>
        </Box>
        <Box width={"100%"}>
          <TextField
            fullWidth
            placeholder={t("professional-id")}
            name="profesional_id"
            value={newSupplierData.profesional_id}
            onChange={handleInputChange}
          />
          {SupplierErrors.profesional_id && (
            <FormError error={SupplierErrors.profesional_id} />
          )}
        </Box>
      </Box>

      <Box display={"flex"} sx={{ flexDirection: "column" }}>
        <Box width={"100%"} marginTop={"0.5rem"}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
              color: "#222222",
              display: "flex",
              alignItems: "end",
            }}
          >
            {t("IBAN-Number-if-applicable")}
          </Typography>
        </Box>
        <Box width={"100%"}>
          <TextField
            fullWidth
            placeholder={t("IBAN-Number-if-applicable")}
            name="iban"
            value={newSupplierData.iban}
            onChange={handleInputChange}
          />
          {SupplierErrors.iban && (
            <FormError error={SupplierErrors.iban} />
          )}
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
        <Box display={"flex"} width={"50%"} sx={{ flexDirection: "column" }}>
          <Box width={"100%"} marginTop={"0.5rem"}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1rem",
                color: "#222222",
                display: "flex",
                alignItems: "end",
              }}
            >
              {t("Bank-Name")}
            </Typography>
          </Box>
          <Box width={"100%"}>
            <TextField
              fullWidth
              placeholder={t("Bank-Name")}
              name="bank_name"
              value={newSupplierData.bank_name}
              onChange={handleInputChange}
            />
            {SupplierErrors.bank_name && (
              <FormError error={SupplierErrors.bank_name} />
            )}
          </Box>
        </Box>
        <Box display={"flex"} width={"50%"} sx={{ flexDirection: "column" }}>
          <Box width={"100%"} marginTop={"0.5rem"}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1rem",
                color: "#222222",
                display: "flex",
                alignItems: "end",
              }}
            >
              {t("BIC number")}
            </Typography>
          </Box>
          <Box width={"100%"}>
            <TextField
              fullWidth
              placeholder={t("BIC number")}
              name="bic_number"
              value={newSupplierData.bic_number}
              onChange={handleInputChange}
            />
            {SupplierErrors.bic_number && (
              <FormError error={SupplierErrors.bic_number} />
            )}
          </Box>
        </Box>
      </Box>

      <Box display={"flex"} sx={{ flexDirection: "column" }}>
        <Box width={"100%"} marginTop={"0.5rem"}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
              color: "#222222",
              display: "flex",
              alignItems: "end",
            }}
          >
            {t("tva-value")}
          </Typography>
        </Box>
        <Box width={"100%"}>
          <TextField
            fullWidth
            placeholder={t("tva")}
            type="number"
            name="tva"
            value={newSupplierData.tva ? newSupplierData.tva : ""}
            onChange={handleInputChange}
          />
          {SupplierErrors.tva && <FormError error={SupplierErrors.tva} />}
        </Box>
      </Box>
    </>
  );
};

export default SupplierDetails;
