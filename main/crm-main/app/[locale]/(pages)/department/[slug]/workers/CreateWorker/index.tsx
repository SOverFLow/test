"use client";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import SyncLockIcon from "@mui/icons-material/SyncLock";
import { RootState } from "@/store";
import { AppBar, Box, Grid, Toolbar, Typography } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { toast } from "react-toastify";
import { Dialog, DialogActions, DialogContent, TextField } from "@mui/material";
import { FormError } from "@/components/ui/FormError/FormError";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { useCreateWorker } from "@/utils/schemas/worker/workerSchema";
import { nanoid } from "nanoid";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import WorkerDetails from "./WorkerDetails";
import Close from "@mui/icons-material/Close";
import theme from "@/styles/theme";
import { useTranslations } from "next-intl";
import NewTaskImages from "../../tasks/[taskId]/TaskImages/NewTaskImages";
import { deleteFileForNewTask, deleteImageForNewTask } from "../../tasks/[taskId]/TaskImages/actions";
import ListFilesForNewTask from "../../tasks/components/NewTaskFiles";

interface props {
  openSteper?: () => void;
}

export default function CreateWorker(props: props) {
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const [images, setImage] = useState<string[]>([]);
  const [filesBlob, setFilesBlob] = useState<any>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations("worker");

  const [allState, setAllState] = useState({
    selectedRole: "",
    returnData: {},
  });

  const [newWorker, setNewWorker] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
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
    supervisor_id: null,
    security_number: "",
    licence_number: "",
    notes: "",
    images: [],
    files: [],
  });

  const handleDeleteImage = async (imgUrl: string[]) => {
    handleCloseDialog();
    for (const img of imgUrl) {
      const { type, message } = await deleteImageForNewTask(img, "worker");
      if (type === "error") {
        toast.error(message);
        // return;
      }
      toast.success("Images deleted successfully");
    }
  };

  const handleDeleteFile = async (fileUrl: string[]) => {
    handleCloseDialog();
    for (const file of fileUrl) {
      const { type, message } = await deleteFileForNewTask(file, "worker");
      if (type === "error") {
        toast.error(message);
        // return;
      }
      toast.success("Files deleted successfully");
    }
  };

  const generatePassword = () => {
    setNewWorker((prevState) => ({
      ...prevState,
      ["password"]: nanoid(12),
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(newWorker.password);
  };

  const handleCloseDialog = () => {
    props.openSteper && props.openSteper();
  };

  const handleNewImages = useCallback((images: string[], url: string[]) => {
    console.log("images :::: 1203", images);
    console.log("url :::: 1203", url);
    setNewWorker((prevState: any) => ({
      ...prevState,
      ["images"]: url,
    }));
  }, []);

  const handleNewFiles = useCallback((files: string[], url: string[]) => {
    setNewWorker((prevState: any) => ({
      ...prevState,
      ["files"]: url,
    }));
  }, []);

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
        ["salary_month"]: parseFloat(value) * 8 * 30,
      }));
      return;
    }
    setNewWorker((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const parseZod = useCreateWorker();
  const onSubmit = async () => {
    const returnvalue = parseZod.safeParse(newWorker);
    if (returnvalue.success) {
      const allData = { ...newWorker, department_id: departmentId, allState };
      try {
        await axios.post("/api/worker", allData);
        toast.success(
          t("worker-added-successfully-we-sent-an-email-to-this-worker"),
          {
            position: "bottom-right",
          }
        );
        setErrors({});
        setNewWorker({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          password: "",
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
          supervisor_id: null,
          security_number: "",
          licence_number: "",
          notes: "",
          images: [],
          files: [],
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          let message =
            error.response?.status == 422
              ? t("a-worker-already-exist-with-this-email")
              : t("an-unexpected-error-occurred");
          if (error.response?.status == 400) {
            message = t("a-worker-already-exist-with-this-username");
          }

          toast.error(message, {
            position: "bottom-right",
          });
        } else {
          toast.error(t("an-unexpected-error-occurred"), {
            position: "bottom-right",
          });
        }
      }

      handleCloseDialog();
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
    <Box>
      <Dialog open={true} onClose={handleCloseDialog} fullScreen>
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
              onClick={() => {
                handleDeleteImage(newWorker.images);
                handleDeleteFile(newWorker.files);
              }}
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
                flex: 1,
              }}
            >
              {t("create-new-worker")}{" "}
            </Typography>
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
                    label={t("first-name")}
                    type="text"
                    fullWidth
                    name="first_name"
                    value={newWorker.first_name}
                    onChange={handleInputChange}
                  />
                  {errors.first_name && <FormError error={errors.first_name} />}
                </Box>
                <Box width={"100%"}>
                  <TextField
                    margin="dense"
                    label={t("last-name")}
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
                placeholder={t("enter-phone-number")}
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
                    label={t("salary-per-hour")}
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
                    label={t("salary-per-day")}
                    type="number"
                    fullWidth
                    name="salary_day"
                    value={newWorker.salary_day}
                    onChange={handleInputChange}
                  />
                  {errors.salary_day && <FormError error={errors.salary_day} />}
                </Box>
                <Box width={"100%"}>
                  <TextField
                    margin="dense"
                    label={t("salary-per-month")}
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

              <TextField
                margin="dense"
                label={t("password")}
                type={showPassword ? "text" : "password"}
                fullWidth
                name="password"
                value={newWorker.password}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={t("generate-password")}>
                        <IconButton onClick={generatePassword}>
                          <SyncLockIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("copy-password")}>
                        <IconButton onClick={handleCopyPassword}>
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        aria-label={t("toggle-password-visibility")}
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {errors.password && <FormError error={errors.password} />}

              <WorkerDetails
                newWorkerData={newWorker}
                setNewWorkerData={setNewWorker}
                WorkerErrors={errors}
              />

              <Grid item xs={12}>
                <NewTaskImages
                  images={images}
                  setImages={setImage}
                  ChangeImages={handleNewImages}
                  folder="worker"
                  table="UserWorker"
                />
              </Grid>

              <Grid item xs={12}>
                <ListFilesForNewTask
                  files={filesBlob}
                  setFiles={setFilesBlob}
                  ChangeFiles={handleNewFiles}
                  folder="worker"
                />
              </Grid>

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
                  label={t("save")}
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
  );
}
