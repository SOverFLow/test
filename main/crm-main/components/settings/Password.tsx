"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Alert, Button, FormControl, Grid } from "@mui/material";
import { ChangeEvent, FormEventHandler, useState, useTransition } from "react";
import { useSelector } from "react-redux";
import { TabButton } from "./Items/TabButton";
import { TabCard } from "./Items/TabCard";
import { TabSubTitle } from "./Items/TabSubTitle";
import { TabTitle } from "./Items/TabTitle";
import PasswordInput from "./Items/passwordInput";
// import { PasswordChangeCardSchema } from "@/schemas/zod/zod.passwordChangeCard";
import passwordChange from "@/app/api/settings/actions/password_change";
import { useTranslations } from "next-intl";
import { useZodPasswordChangeCardSchema } from "@/schemas/zod/zod.passwordChangeCard";

type FormData = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
const Password = () => {
  const PasswordChangeCardSchema = useZodPasswordChangeCardSchema();

  const [formData, setFormData] = useState<FormData>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("SettingsPage.PasswordChangeCard");

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrors("");
    setSuccess("");

    const result = PasswordChangeCardSchema.safeParse(formData);
    if (result.success === false) {
      setErrors(
        result.error.errors[0].path + ": " + result.error.errors[0].message
      );
    } else {
      // here we change the user password
      startTransition(() => {
        passwordChange(formData).then((data) => {
          console.log(data);
          setErrors(data?.error);
          if (data.success) {
            setFormData({
              currentPassword: "",
              newPassword: "",
              confirmNewPassword: "",
            });
            setSuccess(data.success);
          }
        });
      });
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflowY: "auto",
      }}
    >
      {/* <TabCard sx={{ my: 2 }}> */}
      <Typography
        variant="h5"
        component="h1"
        sx={{
          margin: "10px 0",
          textAlign: "left",
        }}
      >
        {t("password")}
      </Typography>
      <Grid
        container
        sx={{
          px: 2,
        }}
      >
        <FormControl
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: "100%" }}
        >
          <Grid item sx={{ mt: 2 }} xs={12} md={8}>
            <TabSubTitle sx={{ mb: 0 }}> {t("current-password")} </TabSubTitle>
            <PasswordInput
              name="currentPassword"
              password={formData.currentPassword}
              handleChange={handleChange}
              placeholder={t("enter-your-current-password")}
            />
          </Grid>

          <Grid item sx={{ my: 4 }} xs={12} md={8}>
            <TabSubTitle sx={{ mb: 0 }}> {t("new-password")} </TabSubTitle>
            <PasswordInput
              name="newPassword"
              password={formData.newPassword}
              handleChange={handleChange}
              placeholder={t("enter-your-new-password")}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TabSubTitle sx={{ mb: 0 }}>
              {" "}
              {t("confirm-new-password")}
            </TabSubTitle>
            <PasswordInput
              name="confirmNewPassword"
              password={formData.confirmNewPassword}
              handleChange={handleChange}
              placeholder={t("confirm-your-new-password")}
            />
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
          </Grid>

          <Button
            type="submit"
            variant="contained"
            sx={{ px: 2, my: 3, width: "fit-content" }}
            disabled={isPending}
          >
            <Typography variant="body2" color={"white"}>
              {t("change-password")}
            </Typography>
          </Button>
        </FormControl>
      </Grid>
      {/* </TabCard> */}
    </Box>
  );
};

export default Password;
