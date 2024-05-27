import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  Typography,
} from "@mui/material";
import { cyan } from "@mui/material/colors";
import CustomTextInput from "../../Items/CustomTextInput";
import { TabParagraph } from "../../Items/TabParagraph";
import TableHeader from "../../Items/TableHeader";
import TableRow from "../../Items/TableRow";
import { useTransition, useState, FormEventHandler, ChangeEvent } from "react";
import { useBankTabSchema } from "@/schemas/zod/zod.BankTab";
import { getAllInfoByISO } from "iso-country-currency";
import addBank from "@/app/api/settings/actions/add_bank";
import { useTranslations } from "next-intl";
type FormData = {
  [x: string]: any;
  Currency?: string;
  Country?: string;
};
export default function NewBankTab() {
  const t = useTranslations("SettingsPage.BankTab");

  const items = [
    {
      title: t("label"),
      inputType: "text",
      name: "Label",
    },
    {
      title: t("bank-name"),
      inputType: "text",
      name: "Bank name",
    },
    {
      title: t("currency"),
      inputType: "currency",
      placeholder: "Select Currency",
      name: "Currency",
    },
    {
      title: t("country"),
      inputType: "country",
      placeholder: "Select Country",
      name: "Country",
    },
    {
      title: t("account-number"),
      inputType: "text",
      name: "Account number",
    },
    {
      title: t("iban-number"),
      inputType: "text",
      name: "IBAN number",
    },
    {
      title: t("bic-swift-code"),
      inputType: "text",
      name: "BIC/SWIFT code",
    },
    {
      title: t("bank-address"),
      inputType: "text",
      name: "Bank address",
    },
    {
      title: t("account-owner-name"),
      inputType: "text",
      name: "Account owner name",
    },
    {
      title: t("account-owner-address"),
      inputType: "text",
      Lines: 2,
      name: "Account owner address",
    },
  ];

  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<FormData>({
    Currency: "EUR",
    Country: "FR",
  });
  const BankTabSchema = useBankTabSchema();
  const [errors, setErrors] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrors("");
    setSuccess("");
    const result = BankTabSchema.safeParse(formData);
    if (result.success === false) {
      console.log("++", result.error.errors);
      if (result.error.errors[0].message === "Required") {
        // setErrors(result.error.errors[0].path[0] + " is required");
        setErrors(t("all-fields-are-required"));
        return;
      }
      setErrors(result.error.errors[0].message);
      return;
    }
    console.log("formData", formData);

    // here we change the user password
    startTransition(() => {
      addBank(result.data).then((data) => {
        if (data?.error) {
          setErrors(data.error);
        } else {
          setFormData({
            Label: "",
            "Bank name": "",
            "Account number": "",
            "IBAN number": "",
            "BIC/SWIFT code": "",
            "Bank address": "",
            "Account owner name": "",
            "Account owner address": "",
          });
          setSuccess(t("your-bank-has-been-added"));
        }
      });
    });
  };
  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <Grid justifyContent={"center"}>
      <Grid item xs={12}>
        <FormControl
          noValidate
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: "100%" }}
        >
          <TabParagraph sx={{ mx: 1, mb: 2, width: "100%" }}>
            {t("new-financial-account")}
          </TabParagraph>
          <Divider
            sx={{
              mb: 2,
            }}
          />
          {/* title */}
          {/* <TableHeader
          items={["Accountant/Bookkeeper", "Value"]}
          sizes={[4, 4]}
        /> */}
          {/* content */}
          <Grid>
            {items.map((item: any, index) => (
              <TableRow
                key={item.name + index}
                sxProps={{ "&:hover": { backgroundColor: cyan[50] } }}
                title={item.title}
              >
                <CustomTextInput
                  handleChange={(e) => {
                    if (typeof e === "string") {
                      setFormData({ ...formData, [item.name]: e });
                      return;
                    } else {
                      setFormData({
                        ...formData,
                        [item.name]: e.target.value,
                      });
                    }
                  }}
                  value={formData[item.name]}
                  name={item.name}
                  placeholder={item.placeholder}
                  type={item.inputType}
                  multiline={item.Lines}
                  InputProps={{ startAdornment: item.inputIcon }}
                />
              </TableRow>
            ))}
          </Grid>
          {/* for Error and Successs messages */}
          {success! && (
            <Alert
              sx={{
                width: "95%",
                mb: 1,
              }}
              severity="success"
            >
              {success}
            </Alert>
          )}
          {errors! && (
            <Alert
              sx={{
                display: "flex",
                width: "95%",
                mb: 1,
              }}
              severity="error"
            >
              {errors}
            </Alert>
          )}
          {/* save Changes */}
          <Box sx={{ mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, width: "fit-content" }}
              // disabled={isPending}
            >
              <Typography variant="body2" color={"white"}>
                {t("create-account")}
              </Typography>
            </Button>
          </Box>
        </FormControl>
      </Grid>
    </Grid>
  );
}
