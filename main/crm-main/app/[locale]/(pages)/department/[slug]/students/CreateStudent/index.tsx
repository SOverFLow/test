"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SyncLockIcon from "@mui/icons-material/SyncLock";
import { RootState } from "@/store";
import axios from "axios";
import {
  AppBar,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { Dialog, DialogContent, TextField } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { FormError } from "@/components/ui/FormError/FormError";
import { nanoid } from "nanoid";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import Close from "@mui/icons-material/Close";
import theme from "@/styles/theme";
import { useTranslations } from "next-intl";
import InputDataStudent from "../utils/formSchema";
import { studentSchema } from "@/utils/schemas/student/studentSchema";
import { getDepartementClients } from "./actions";
import { createClient } from "@/utils/supabase/client";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import CreateClient from "../../clients/CreateClient";

interface props {
  openSteper?: () => void;
}

export default function CreateStudent(props: props) {
  const t = useTranslations("student");
  const supabase = createClient();
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );

  const [dialogOpenClient, setDialogOpenClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [clients, setClients] = useState<any>([]);
  const [selectedClients, setSelectedClients] = useState("");
  const [newStudent, setNewStudent] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    budget: "",
    date_of_birth: "",
    level: "",
    notes: "",
    registration_date: new Date(),
    address: "",
    payment_method: "",
    social_security_number: "",
    client_id: null,
  });
  const generatePassword = () => {
    setNewStudent((prevState: any) => ({
      ...prevState,
      ["password"]: nanoid(12),
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(newStudent.password);
  };

  const handleCloseDialog = () => {
    props.openSteper && props.openSteper();
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    if (
      newStudent.email &&
      newStudent.password &&
      newStudent.address &&
      newStudent.first_name &&
      newStudent.last_name &&
      newStudent.phone &&
      newStudent.budget
    ) {
      setIsDisabled(false);
    }
    setNewStudent((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function handleOpenClient() {
    setDialogOpenClient(false);
  }

  useEffect(() => {
    const getClients = async () => {
      if (!departmentId) {
        return;
      }
      getDepartementClients(departmentId).then((data) => {
        if (data.data) {
          setClients(data.data);
        }
      });
    };
    getClients();
  }, [departmentId]);

  useEffect(() => {
    const clientsChannel = supabase
      .channel("realtime:clientsChannel_status")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Client" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setClients((prevContract: any) => [
              ...prevContract,
              {
                name: payload.new.first_name + " " + payload.new.last_name,
                uid: payload.new.uid,
              },
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      clientsChannel.unsubscribe();
    };
  });

  const handleClientChange = (event: any) => {
    setSelectedClients(event.target.value as string);
    setNewStudent((prevState: any) => ({
      ...prevState,
      ["client_id"]: event.target.value,
    }));
  };

  const onSubmit = async () => {
    const returnvalue = studentSchema.safeParse(newStudent);
    if (returnvalue.success) {
      const allData = { ...newStudent, department_id: departmentId };

      try {
        await axios.post("/api/student", allData);
        toast.success(
          t("student-added-successfully-we-sent-an-email-to-this-student"),
          {
            position: "bottom-right",
          }
        );
        setErrors({});
        handleCloseDialog();
        setNewStudent({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          password: "",
          budget: "",
          date_of_birth: "",
          level: "",
          notes: "",
          registration_date: "",
          address: "",
          payment_method: "",
          social_security_number: "",
          client_id: null,
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          let message =
            error.response?.status == 422
              ? t("a-student-already-exist-with-this-email")
              : t("an-unexpected-error-occurred");
          if (error.response?.status == 400) {
            message = t("a-student-already-exist-with-this-username");
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
                flex: 1,
              }}
            >
              {t("create-new-student")}{" "}
            </Typography>
          </Toolbar>
        </AppBar>

        <DialogContent>
          <Box sx={{ mt: 1, width: "30rem", margin: "auto", maxWidth: "90%" }}>
            {InputDataStudent().map((input, index) => (
              <Box key={index}>
                {input.componentType === "text" && (
                  <TextField
                    margin="dense"
                    fullWidth
                    label={input.label}
                    type={input.type || "text"}
                    name={input.name}
                    variant="outlined"
                    value={newStudent[input.name] || ""}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                      required: input.isRequired,
                    }}
                  />
                )}

                {input.componentType === "password" && (
                  <Box width={"100%"}>
                    <TextField
                      autoFocus
                      margin="dense"
                      label={t("password")}
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      name="password"
                      value={newStudent.password}
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
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                )}
                {input.componentType === "phoneInput" && (
                  <PhoneInput
                    specialLabel=""
                    country={"fr"}
                    value={newStudent.phone}
                    onChange={(phone: string) =>
                      handleInputChange({
                        target: { name: "phone", value: phone },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                    inputStyle={{ width: "100%", margin: "4px 0px" }}
                    placeholder={t("enter-phone-number")}
                  />
                )}

                {input.componentType === "select" && (
                  <Box sx={{ margin: "8px 0px" }}>
                    <FormControl fullWidth>
                      <InputLabel>{input.label}</InputLabel>
                      <Select
                        value={newStudent[input.name] || ""}
                        label="Age"
                        onChange={handleInputChange}
                        name={input.name}
                      >
                        {(input.selects ?? []).map((select, index) => (
                          <MenuItem key={index} value={select}>
                            {select}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}
                {errors[input.name] && <FormError error={errors[input.name]} />}
              </Box>
            ))}
            <Box
              display={"flex"}
              gap={"0.5rem"}
              sx={{
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-around",
                alignItems: "top",
                mt: 0.5,
              }}
            >
              <Box width={"100%"}>
                <FormControl fullWidth>
                  <InputLabel id="contract-select-label">{"Client"}</InputLabel>
                  <Select
                    labelId="contract-select-label"
                    id="contract-select"
                    value={selectedClients}
                    label={"Client"}
                    onChange={handleClientChange}
                  >
                    {clients.map((client: any) => (
                      <MenuItem key={client.uid} value={client.uid}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box width={"40%"}>
                <CustumButton
                  onClick={() => {
                    setDialogOpenClient(true);
                  }}
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 550,
                    height: "3rem",
                    width: "100%",
                    textTransform: "none",
                    color: "#fff",
                    backgroundColor: theme.palette.primary.main,
                  }}
                  label={<>add client</>}
                />

                {dialogOpenClient && (
                  <CreateClient openSteper={handleOpenClient} />
                )}
              </Box>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
              sx={{ mt: 3, mb: 2, textTransform: "none", color: "white" }}
              onClick={onSubmit}
            >
              {t("save")}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
