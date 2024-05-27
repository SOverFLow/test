import getCompanyInfo from "@/app/api/settings/actions/get_company_info";
import updateCompanyAccountant from "@/app/api/settings/actions/update_company_accountant";
import { useZodAccountantTabSchema } from "@/schemas/zod/zod.AccountantTab";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  Typography,
} from "@mui/material";
import { cyan } from "@mui/material/colors";
import { useTranslations } from "next-intl";
import { FormEventHandler, useEffect, useState, useTransition } from "react";
import CustomTextInput from "../../Items/CustomTextInput";
import { TabParagraph } from "../../Items/TabParagraph";
import TableHeader from "../../Items/TableHeader";
import TableRow from "../../Items/TableRow";
type AccountantTabTableRow = {
  title: string;
  inputType: string;
  inputIcon?: JSX.Element;
  Lines?: number;
  name: string;
};

type FormData = {
  [x: string]: any;
  Name?: string;
  Zip?: string;
  Town?: string;
  Country?: string;
  Phone?: string;
  Address?: string;
  EMail?: string;
  Web?: string;
  ["Accountant code"]?: string;
  Note?: string;
};
export default function AccountantTab() {
  const t = useTranslations("SettingsPage.CompanyTab");
  const items = [
    {
      title: t("name"),
      name: "Name",
      inputType: "text",
    },
    {
      title: t("address"),
      name: "Address",
      inputType: "text",
      Lines: 3,
    },
    {
      title: t("zip"),
      name: "Zip",
      inputType: "text",
    },
    {
      title: t("town"),
      name: "Town",
      inputType: "text",
    },
    {
      title: t("country-0"),
      name: "Country",
      inputType: "country",
    },
    {
      title: t("phone"),
      name: "Phone",
      inputType: "phone",
      inputIcon: (
        <LocalPhoneOutlinedIcon
          sx={{
            color: cyan[500],
            pr: 0.5,
          }}
        />
      ),
    },
    {
      title: t("email"),
      name: "EMail",
      inputType: "text",
      inputIcon: (
        <AlternateEmailOutlinedIcon
          sx={{
            color: cyan[500],
            pr: 0.5,
          }}
        />
      ),
    },
    {
      title: t("web"),
      name: "Web",
      inputType: "text",
      inputIcon: (
        <LaunchOutlinedIcon
          sx={{
            color: cyan[500],
            pr: 0.5,
          }}
        />
      ),
    },
    {
      title: t("accountant-code"),
      name: "Accountant code",
      inputType: "text",
    },
    {
      title: t("note"),
      name: "Note",
      inputType: "text",
      Lines: 3,
    },
  ];
  const [isPending, startTransition] = useTransition();
  const AccountantTabSchema = useZodAccountantTabSchema();
  const [isPending2, startTransition2] = useTransition();
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrors("");
    setSuccess("");

    const result = AccountantTabSchema.safeParse(formData);
    if (result.success === false) {
      console.log("++", result.error.errors[0].message),
        setErrors(result.error.errors[0].message);
      return;
    }
    console.log("formData", formData);

    // here we change the user password
    startTransition(() => {
      updateCompanyAccountant(formData).then((data) => {
        if (data?.error) {
          setErrors(data.error);
        } else {
          setSuccess(data.success);
        }
      });
    });
  };

  useEffect(() => {
    async function getData() {
      startTransition2(() => {
        getCompanyInfo().then((data: any) => {
          if (data?.error) {
            setErrors(data.error);
          } else {
            const res = data?.success;
            setFormData({
              Name: res?.accountant_name,
              Address: res?.accountant_address,
              Zip: res?.accountant_zip,
              Town: res?.accountant_town,
              Country: res?.accountant_country,
              Phone: res?.accountant_phone,
              EMail: res?.accountant_email,
              Web: res?.accountant_web,
              ["Accountant code"]: res?.accountant_code,
              Note: res?.accountant_note,
            });
          }
        });
      });
    }
    getData();
  }, []);

  return (
    <Grid justifyContent={"center"}>
      <Grid item xs={12}>
        <TabParagraph sx={{ mx: 1, mb: 2, width: "100%" }}>
          {t(
            "if-you-have-an-external-accountant-bookkeeper-you-can-edit-here-its-information"
          )}
        </TabParagraph>
        <FormControl
          noValidate
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: "100%" }}
        >
          {/* title */}
          <TableHeader
            items={[t("accountant-bookkeeper"), t("value")]}
            sizes={[4, 4]}
          />
          {/* content */}
          <Grid>
            {items.map((item: AccountantTabTableRow, index) => (
              <TableRow
                hasDivider={true}
                key={item.name + index}
                sxProps={{ "&:hover": { backgroundColor: cyan[50] } }}
                title={item.title}
              >
                <CustomTextInput
                  name={item.name}
                  placeholder=""
                  value={formData[item.name]}
                  handleChange={(e) => {
                    if (typeof e === "string") {
                      setFormData({ ...formData, [item.name]: e });
                      return;
                    }
                    setFormData({ ...formData, [item.name]: e.target.value });
                  }}
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
                my: 1,
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
                my: 1,
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
              disabled={isPending}
            >
              <Typography variant="body2" color={"white"}>
                {t("save-changes")}
              </Typography>
            </Button>
          </Box>
        </FormControl>
      </Grid>
    </Grid>
  );
}
