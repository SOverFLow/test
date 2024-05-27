"use client";
import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import { FormError } from "@/components/ui/FormError/FormError";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { EditClientSchema } from "@/utils/schemas/client/clientSchema";
import EditIcon from "@mui/icons-material/Edit";
import "react-phone-input-2/lib/material.css";
import axios from "axios";
import Close from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import theme from "@/styles/theme";
import { useTranslations } from "next-intl";
import CreateBien from "../../biens/CreateBien";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { createClient } from "@/utils/supabase/client";
import { getStudentData } from "./utils";
import { EditStudentSchema } from "@/utils/schemas/student/studentSchema";
import { InputDataStudentEdit } from "../utils/formSchema";

interface EditStudentProps {
  studentId: number | string;
}

export default function EditStudent(props: EditStudentProps) {
  const supabase = createClient();
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fetchIndex, setFetchIndex] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const t = useTranslations("student");

  const [newStudent, setNewStudent] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    budget: "",
    level: "",
    notes: "",
    address: "",
    payment_method: "",
    social_security_number: "",
  });

  useMemo(() => {
    if (fetchIndex) {
    }
    if (props.studentId) {
      getStudentData(props.studentId)
        .then((data) => setNewStudent(data))
        .catch((error) => console.error(error));
    }
  }, [props.studentId, fetchIndex]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    const { name, value } = event.target;
    if (
      newStudent.email &&
      newStudent.first_name &&
      newStudent.address &&
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

  const onSubmit = async () => {
    const returnvalue = EditStudentSchema.safeParse(newStudent);
    if (returnvalue.success) {
      const allData = { ...newStudent, user_id: props.studentId };
      try {
        await axios.put("/api/student", allData);
        toast.success(t("student-edited-successfully"), {
          position: "bottom-right",
        });
        setErrors({});
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
        setFetchIndex(Math.random());
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
    <Box>
      <Box>
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
          title={t("edit-student")}
        >
          <EditIcon />
        </Button>
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
                flex: 1,
                textAlign: "center",
              }}
            >
              {t("edit-student")}{" "}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Box sx={{ mt: 1, width: "30rem", margin: "auto", maxWidth: "90%" }}>
            {InputDataStudentEdit().map((input, index) => (
              <Box key={index}>
                {input.componentType === "text" && (
                  <TextField
                    margin="dense"
                    fullWidth
                    label={input?.label}
                    type={input?.type || "text"}
                    name={input?.name}
                    variant="outlined"
                    value={newStudent[input?.name] || ""}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                      required: input?.isRequired,
                    }}
                  />
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
