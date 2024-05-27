"use client";
import React, { useMemo, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { toast } from "react-toastify";
import {
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import { Dialog, DialogActions, DialogContent, TextField } from "@mui/material";
import { FormError } from "@/components/ui/FormError/FormError";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { useEditWorker } from "@/utils/schemas/worker/workerSchema";
import { getWorkerData } from "./utils";
import axios from "axios";
import Close from "@mui/icons-material/Close";
import WorkerDetails from "../CreateWorker/WorkerDetails";
import theme from "@/styles/theme";
import { useTranslations } from "next-intl";

interface EditWorkerProps {
  worekerId: number | string;
}

export default function EditWorker(props: EditWorkerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fetchIndex, setFetchIndex] = useState(0);
  const t = useTranslations("worker");

  const [newWorker, setNewWorker] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    salary_hour: 0.0,
    salary_day: 0.0,
    salary_month: 0.0,
    gender: "",
    zip_code: "",
    city: "",
    state_province: "",
    address: "",
    country: "",
    job_position: "",
    employment_date: "",
    date_of_birth: "",
    supervisor_id: null as string | null,
  });

  useMemo(() => {
    if (fetchIndex) {
    }
    if (props.worekerId) {
      getWorkerData(props.worekerId)
        .then((data) =>
          setNewWorker((prev: typeof newWorker) =>
            data ? { ...data, salary_month: data.salary_hour * 152 } : prev
          )
        )
        .catch((error) => console.error(error));
    }
  }, [props.worekerId, fetchIndex]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "salary_day" || name === "salary_month") {
      setNewWorker((prevState) => ({
        ...prevState,
        [name]: parseFloat(value),
      }));
      return;
    }
    if (name === "salary_hour") {
      setNewWorker((prevState) => ({
        ...prevState,
        [name]: parseFloat(value),
        ["salary_day"]: parseFloat(value) * 8,
        ["salary_month"]: parseFloat(value) * 8 * 20,
      }));
      return;
    }
    setNewWorker((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const parseZod = useEditWorker();
  const onSubmit = async () => {
    const returnvalue = parseZod.safeParse(newWorker);
    if (returnvalue.success) {
      const allData = { ...newWorker, user_id: props.worekerId };

      try {
        await axios.put("/api/worker", allData);
        toast.success(t('worker-edited-successfully'), {
          position: "bottom-right",
        });
        setErrors({});
      } catch (error) {
        if (axios.isAxiosError(error)) {
          let message =
            error.response?.status == 422
              ? t('a-worker-already-exist-with-this-email')
              : t('an-unexpected-error-occurred');
          if (error.response?.status == 400) {
            message = t('a-worker-already-exist-with-this-information');
          }

          toast.error(message, {
            position: "bottom-right",
          });
          setFetchIndex(Math.random());
        } else {
          toast.error(t('an-unexpected-error-occurred'), {
            position: "bottom-right",
          });
          setFetchIndex(Math.random());
        }
      }

      setDialogOpen(false);
    } else {
      returnvalue.error.issues.reduce(
        (acc: any, issue: any) => {
          acc[issue.path[0]] = issue.message;
          setErrors(acc);
          return acc;
        },
        {} as Record<string, string>
      );
      toast.error(t("fill-the-required-fields"), {
        position: "bottom-right",
      });
    }
  };

  return (
    <>
      <Box>
        <Box>
          <Tooltip title={t('edit-worker')} disableInteractive>
            <Button
              variant="text"
              color="info"
              onClick={handleOpenDialog}
              sx={{
                width: "30px",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
              size="small"
            >
              <EditIcon />
            </Button>
          </Tooltip>
        </Box>

        <Dialog open={dialogOpen} onClose={handleCloseDialog} fullScreen>
          <AppBar
            sx={{
              position: "relative",
              backgroundColor: "#f5f5f5",
            }}
          >
            <Toolbar
              sx={{
                display: "flex",
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseDialog}
                aria-label="close"
                sx={{ marginLeft: "1rem" }}
              >
                <Close
                  sx={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: theme.palette.primary.main,
                  }}
                />
              </IconButton>

              <Typography
                sx={{
                  marginLeft: "1rem",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: theme.palette.primary.main,
                  textAlign: "center",
                  flex:1,
                }}
              >
                {t('edit-worker')} </Typography>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <Grid
              container
              sx={{ width: "30rem", height: "23rem", maxWidth: "100%" }}
            >
              <Grid item md={12} xs={12}>
                <Box
                  display={"flex"}
                  gap={"1rem"}
                  sx={{ flexDirection: { xs: "column", md: "row" } }}
                >
                  <Box width={"100%"}>
                    <TextField
                      margin="dense"
                      label={t('first-name')}
                      type="text"
                      fullWidth
                      name="first_name"
                      value={newWorker.first_name}
                      onChange={handleInputChange}
                    />
                    {errors.first_name && (
                      <FormError error={errors.first_name} />
                    )}
                  </Box>
                  <Box width={"100%"}>
                    <TextField
                      margin="dense"
                      label={t('last-name')}
                      type="text"
                      fullWidth
                      name="last_name"
                      value={newWorker.last_name}
                      onChange={handleInputChange}
                    />
                    {errors.last_name && <FormError error={errors.last_name} />}
                  </Box>
                </Box>

                <Box
                  display={"flex"}
                  gap={"1rem"}
                  sx={{ flexDirection: { xs: "column", md: "row" } }}
                >
                  <Box width={"100%"}>
                    <TextField
                      margin="dense"
                      label={"email"}
                      type="email"
                      fullWidth
                      name="email"
                      value={newWorker.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && <FormError error={errors.email} />}
                  </Box>
                </Box>

                <PhoneInput
                  country={"fr"}
                  value={newWorker.phone}
                  onChange={(phone: string) =>
                    handleInputChange({
                      target: { name: "phone", value: phone },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                  inputStyle={{ width: "100%", margin: "4px 0px" }}
                  placeholder={t('enter-phone-number')}
                />

                {errors.phone && <FormError error={errors.phone} />}

                <Box
                  display={"flex"}
                  gap={"1rem"}
                  sx={{ flexDirection: { xs: "column", md: "row" } }}
                >
                  <Box width={"100%"}>
                    <TextField
                      margin="dense"
                      label={t('salary-per-hour')}
                      type="number"
                      fullWidth
                      name="salary_hour"
                      value={newWorker.salary_hour}
                      onChange={handleInputChange}
                    />
                    {errors.salary_hour && (
                      <FormError error={errors.salary_hour} />
                    )}
                  </Box>

                  <Box width={"100%"}>
                    <TextField
                      margin="dense"
                      label={t('salary-per-day')}
                      type="number"
                      fullWidth
                      name="salary_day"
                      value={newWorker.salary_day}
                      onChange={handleInputChange}
                    />
                    {errors.salary_day && (
                      <FormError error={errors.salary_day} />
                    )}
                  </Box>
                  <Box width={"100%"}>
                    <TextField
                      margin="dense"
                      label={t('salary-per-month')}
                      type="number"
                      fullWidth
                      name="salary_month"
                      value={newWorker.salary_month}
                      onChange={handleInputChange}
                    />
                    {errors.salary_month && (
                      <FormError error={errors.salary_month} />
                    )}
                  </Box>
                </Box>

                <WorkerDetails
                  newWorkerData={newWorker}
                  setNewWorkerData={setNewWorker}
                  WorkerErrors={errors}
                  workerId={props.worekerId}
                />
                <Grid
              item
              md={12}
              xs={12}
              marginTop={"1rem"}
              justifyContent={"end"}
              alignItems={"end"}
              display={"flex"}
              marginBottom={"1rem"}
            >
              <CustumButton
                label={t('save')}
                onClick={onSubmit}
                style={{
                  width: "150px",
                  fontSize: "1rem",
                  fontWeight: "700",
                }}
              />
            </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
}
