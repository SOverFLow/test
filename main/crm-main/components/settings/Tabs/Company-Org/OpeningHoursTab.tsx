"use client";
import getCompanyInfo from "@/app/api/settings/actions/get_company_info";
import updateCompanyOpenningHours from "@/app/api/settings/actions/update_company_opening_hours";
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  Typography,
} from "@mui/material";
import { cyan } from "@mui/material/colors";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { FormEventHandler, useEffect, useState, useTransition } from "react";
import TableHeader from "../../Items/TableHeader";
import TableRow from "../../Items/TableRow";
import { TabParagraph } from "../../Items/TabParagraph";
import PickerTime2 from "../../Items/TimePicker2";

type FormData = {
  [x: string]: any;
  monday_start_hour?: string;
  monday_end_hour?: string;
  tuesday_start_hour?: string;
  tuesday_end_hour?: string;
  wednesday_start_hour?: string;
  wednesday_end_hour?: string;
  thursday_start_hour?: string;
  thursday_end_hour?: string;
  friday_start_hour?: string;
  friday_end_hour?: string;
  saturday_start_hour?: string;
  saturday_end_hour?: string;
  sunday_start_hour?: string;
  sunday_end_hour?: string;
};

export default function OpeningHoursTab() {
  const t = useTranslations("SettingsPage.CompanyTab");
  const weekdays = [
    {
      key: "monday",
      value: t("monday"),
    },
    {
      key: "tuesday",
      value: t("tuesday"),
    },
    {
      key: "wednesday",
      value: t("wednesday"),
    },
    {
      key: "thursday",
      value: t("thursday"),
    },
    {
      key: "friday",
      value: t("friday"),
    },
    {
      key: "saturday",
      value: t("saturday"),
    },
    {
      key: "sunday",
      value: t("sunday"),
    },
  ];

  const [isPending, startTransition] = useTransition();
  const [isPending2, startTransition2] = useTransition();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    monday_start_hour: "",
    monday_end_hour: "",
    tuesday_start_hour: "",
    tuesday_end_hour: "",
    wednesday_start_hour: "",
    wednesday_end_hour: "",
    thursday_start_hour: "",
    thursday_end_hour: "",
    friday_start_hour: "",
    friday_end_hour: "",
    saturday_start_hour: "",
    saturday_end_hour: "",
    sunday_start_hour: "",
    sunday_end_hour: "",
  });
  const [errors, setErrors] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    console.log("formData", formData);

    startTransition(() => {
      updateCompanyOpenningHours(formData).then((data) => {
        if (data?.error) {
          setErrors(data.error);
        } else {
          setSuccess(data.success);
        }
      });
    });
  };

  const handleCustomHoursChange = (time: any, day: string) => {
    const openHours =
      new Date(time[0]).getHours() + ":" + new Date(time[0]).getMinutes();
    const closeHours =
      new Date(time[1]).getHours() + ":" + new Date(time[1]).getMinutes();
    // const openHours = new Date(time[0]);
    // const closeHours = new Date(time[1]);
    setFormData({
      ...formData,
      [day.toLowerCase() + "_start_hour"]: openHours,
      [day.toLowerCase() + "_end_hour"]: closeHours,
    });
    setSuccess("");
    setErrors("");

    console.log("formData", formData);
  };
  useEffect(() => {
    async function getData() {
      startTransition2(() => {
        getCompanyInfo().then((data: any) => {
          if (data?.error) {
            setErrors(data.error);
          } else {
            const res = data?.success;
            if (!res) return;

            setFormData({
              monday_start_hour: res.monday_start_hour,
              monday_end_hour: res.monday_end_hour,
              tuesday_start_hour: res.tuesday_start_hour,
              tuesday_end_hour: res.tuesday_end_hour,
              wednesday_start_hour: res.wednesday_start_hour,
              wednesday_end_hour: res.wednesday_end_hour,
              thursday_start_hour: res.thursday_start_hour,
              thursday_end_hour: res.thursday_end_hour,
              friday_start_hour: res.friday_start_hour,
              friday_end_hour: res.friday_end_hour,
              saturday_start_hour: res.saturday_start_hour,
              saturday_end_hour: res.saturday_end_hour,
              sunday_start_hour: res.sunday_start_hour,
              sunday_end_hour: res.sunday_end_hour,
            });
          }
        });
      });
    }
    getData();
  }, []);
  return (
    <Grid justifyContent={"center"}>
      <Grid item xs={12} sm={12}>
        <TabParagraph sx={{ mx: 1, mb: 2, width: "100%" }}>
          {t("enter-here-the-regular-buisness-hours-of-your-company")}
        </TabParagraph>
        <FormControl
          noValidate
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: "100%" }}
        >
          {/* title */}
          <TableHeader items={[t("day"), t("value")]} sizes={[4, 4]} />

          {/* content */}
          {weekdays.map((day: any) => (
            <TableRow
              hasDivider={true}
              key={day.key}
              sxProps={{ "&:hover": { backgroundColor: cyan[50] } }}
              title={day.value}
              tooltip={`Use a - to separate opening and closing hours.\n
          Use a space to enter different ranges.\n
          Example: 8-12 14-18`}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "left",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: "0.5rem",
                }}
              >
                <PickerTime2
                  value={[
                    dayjs(
                      formData[day.key.toLowerCase() + "_start_hour"],
                      "HH:mm"
                    ),
                    dayjs(
                      formData[day.key.toLowerCase() + "_end_hour"],
                      "HH:mm"
                    ),
                  ]}
                  onChange={(time: any) => {
                    handleCustomHoursChange(time, day.key);
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    justifyContent: "center",
                    width: "100%",
                    gap: "0.5rem",
                  }}
                ></Box>
              </Box>
            </TableRow>
          ))}
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
              type={"submit"}
              variant="contained"
              sx={{ mt: 3, width: "fit-content" }}
              disabled={isPending} // Disable the button if editing mode is enabled and the form is pending
            >
              <Typography variant="body2" color="white">
                {t("save-changes")}
              </Typography>
            </Button>
          </Box>
        </FormControl>
      </Grid>
    </Grid>
  );
}
