import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { FormEventHandler, useEffect, useState, useTransition } from "react";
import { TabParagraph } from "../../Items/TabParagraph";
import TableHeader from "../../Items/TableHeader";
import HourPriceInput from "../../Items/hourPriceInput";
import TableRow from "../../Items/TableRow";
import { cyan } from "@mui/material/colors";
import CustomTextInput from "../../Items/CustomTextInput";
import { MultipleDatePicker } from "../../Items/MultipleDatePicker";
import updateCompanyPricingHours from "@/app/api/settings/actions/update_company_PricingHour";
import getCompanyInfo from "@/app/api/settings/actions/get_company_info";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import getDepartementSettingsInfo from "@/app/api/settings/actions/get_departemen_settings_info";
import { useParams } from "next/navigation";

type InputHourPrice = {
  startTime: string;
  endTime: string;
  priceMultiplication: string;
};

type FormData = {
  timeRanges: InputHourPrice[];
  saturdayPriceMultiplication: string;
  sundayPriceMultiplication: string;
  daysOff: {
    dates: string[];
    priceMultiplication: string;
  };
};

const defaultFormData: FormData = {
  timeRanges: [
    { startTime: "7:00", endTime: "18:00", priceMultiplication: "1" },
    { startTime: "18:00", endTime: "20:00", priceMultiplication: "1.25" },
    { startTime: "20:00", endTime: "00:00", priceMultiplication: "1.5" },
    { startTime: "00:00", endTime: "7:00", priceMultiplication: "2" },
  ],
  saturdayPriceMultiplication: "1.5",
  sundayPriceMultiplication: "2",
  daysOff: {
    dates: [],
    priceMultiplication: "2",
  },
};

export default function HourPricingTab() {
  const t = useTranslations("SettingsPage.CompanyTab");
  const { slug } = useParams();
  const departement_id = (slug as string) ?? "";
  const noromalItems = [
    {
      name: "saturdayPriceMultiplication",
      title: t("saturday"),
      value: "1.5",
    },
    {
      name: "sundayPriceMultiplication",
      title: t("sunday"),
      value: "2",
    },
  ];

  const [errors, setErrors] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending2, startTransition2] = useTransition();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrors("");
    setSuccess("");
    console.log("formData", formData);
    try {
      // here we change the user password
      startTransition(() => {
        updateCompanyPricingHours(formData, departement_id).then((data) => {
          if (data?.error) {
            setErrors(data.error);
          } else {
            setSuccess(data.success);
          }
        });
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    async function getData() {
      startTransition2(() => {
        getDepartementSettingsInfo(departement_id).then((data: any) => {
          if (data?.error) {
            setErrors(data.error);
          } else {
            const res = data?.success;
            if (!res) return;
            setFormData({
              timeRanges: res.pricing_hours.timeRanges,
              saturdayPriceMultiplication:
                res.pricing_hours.saturdayPriceMultiplication,
              sundayPriceMultiplication:
                res.pricing_hours.sundayPriceMultiplication,
              daysOff: {
                dates: res.pricing_hours.daysOff.dates,
                priceMultiplication:
                  res.pricing_hours.daysOff.priceMultiplication,
              },
            });
          }
        });
      });
    }
    getData();
  }, [departement_id]);

  const handleInputChange = (name: string, value: string, index?: number) => {
    setErrors("");
    setSuccess("");
    if (typeof index === "number") {
      const updatedTimeRanges = [...formData.timeRanges];
      updatedTimeRanges[index][name as keyof InputHourPrice] = value;
      setFormData({ ...formData, timeRanges: updatedTimeRanges });
    } else if (name === "daysOff.priceMultiplication") {
      setFormData({
        ...formData,
        daysOff: { ...formData.daysOff, priceMultiplication: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // add condition for days off
  };

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
            {t("hour-pricing")}
          </TabParagraph>

          {/* title */}
          <TableHeader
            items={[t("hours-price-settings"), t("value")]}
            sizes={[4, 4]}
          />
          {/* content */}
          <Grid>
            {formData.timeRanges.map((item: any, index) => (
              <TableRow
                hasDivider={true}
                key={`TimeRange-${index}`}
                sxProps={{ "&:hover": { backgroundColor: cyan[50] } }}
                title={t("time-range") + (index + 1)}
              >
                <HourPriceInput
                  pricePlaceholder={t("price-multiplication")}
                  startTime={item.startTime}
                  endTime={item.endTime}
                  priceValue={item.priceMultiplication}
                  onStartTimeChange={(newValue: any) =>
                    handleInputChange(
                      "startTime",
                      newValue.format("HH:mm"),
                      index
                    )
                  }
                  onEndTimeChange={(newValue: any) =>
                    handleInputChange(
                      "endTime",
                      newValue.format("HH:mm"),
                      index
                    )
                  }
                  onPriceChange={(e) => {
                    console.log("e.target.value", e.target.value);
                    if (isNaN(Number(e.target.value))) {
                      setErrors("Please enter a valid number");
                      return;
                    }
                    handleInputChange(
                      "priceMultiplication",
                      e.target.value,
                      index
                    );
                  }}
                  // />
                />
              </TableRow>
            ))}
          </Grid>
          <Grid>
            {noromalItems.map((item, index) => (
              <TableRow
                hasDivider={true}
                key={item.name + index}
                sxProps={{ "&:hover": { backgroundColor: cyan[50] } }}
                title={item.title}
              >
                <TextField
                  placeholder={"price multiplication"}
                  value={formData[item.name as keyof FormData]}
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) {
                      setErrors("Please enter a valid number");
                      return;
                    }
                    handleInputChange(item.name, e.target.value);
                  }}
                  sx={{
                    ml: 1,
                    "& .MuiInputBase-root": {
                      backgroundColor: "white",
                      height: 38,
                      my: 0.5,
                    },
                    "& input::placeholder": {
                      fontSize: 14,
                    },
                    m: 0,
                    width: 200,
                  }}
                />
              </TableRow>
            ))}
          </Grid>

          <TableRow
            hasDivider={true}
            sxProps={{ "&:hover": { backgroundColor: cyan[50] } }}
            title={t("days-off")}
          >
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
              <MultipleDatePicker
                value={formData.daysOff.dates.map((date) => dayjs(date))}
                onChange={(dates) => {
                  console.log("dates", dates);
                  setFormData({
                    ...formData,
                    daysOff: {
                      ...formData.daysOff,
                      dates: dates.map((date) => date.format("YYYY-MM-DD")),
                    },
                  });
                }}
              />

              <TextField
                placeholder={t("price-multiplication")}
                value={formData.daysOff.priceMultiplication}
                // onChange={onPriceChange}
                onChange={(e) => {
                  if (isNaN(Number(e.target.value))) {
                    return;
                  }
                  handleInputChange(
                    "daysOff.priceMultiplication",
                    e.target.value
                  );
                }}
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
          </TableRow>
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
