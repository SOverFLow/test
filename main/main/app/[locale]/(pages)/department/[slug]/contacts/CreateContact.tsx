"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import AddIcon from "@mui/icons-material/Add";
import {
  AppBar,
  Box,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { Dialog, DialogContent, TextField } from "@mui/material";
import { FormError } from "@/components/ui/FormError/FormError";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { contactSchema } from "@/utils/schemas/contact/contactSchema";
import { createContact } from "./utils/fetchClientContacts";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import Close from "@mui/icons-material/Close";
import theme from "@/styles/theme";
import { useTranslations } from "next-intl";
import { contactStatus } from "../utils/dataUnits";

export default function CreateContact() {
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const t = useTranslations("Contact");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [newContact, setnewContact] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    status: "",
  });

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setnewContact((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = () => {
    const returnvalue = contactSchema.safeParse(newContact);
    if (returnvalue.success) {
      const allData = { ...newContact, department_id: departmentId };
      createContact(allData)
        .then(() => {
          toast.success(t("Contact-created-successfully"), {
            position: "bottom-right",
          });
          setErrors({});
        })
        .catch((error) => {
          toast.error(t("error"), {
            position: "bottom-right",
          });
        });
      setnewContact({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        status: "",
      });
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
        <CustumButton
          label={
            <>
              <AddIcon />
              {t("Create-New-Contact")}
            </>
          }
          onClick={handleOpenDialog}
        />
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
                flex:1,
                textAlign:"center"
              }}
            >
              {t("Create-New-Contact")}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Grid
            container
            sx={{ width: "30rem", height: "23rem", maxWidth: "100%" }}
          >
            <Grid item md={12} xs={12}>
              <TextField
                margin="dense"
                label={t("Full-Name")}
                type="text"
                fullWidth
                name="full_name"
                value={newContact.full_name}
                onChange={handleInputChange}
              />
              {errors.full_name && <FormError error={errors.full_name} />}
              <TextField
                margin="dense"
                label={t("Email")}
                type="email"
                fullWidth
                name="email"
                value={newContact.email}
                onChange={handleInputChange}
              />
              {errors.email && <FormError error={errors.email} />}

              <PhoneInput
                country={"fr"}
                value={newContact.phone}
                onChange={(phone: string) =>
                  handleInputChange({
                    target: { name: "phone", value: phone },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                inputStyle={{ width: "100%", margin: "4px 0px" }}
                placeholder={t("placeholder_phone")}
              />
              {errors.phone && <FormError error={errors.phone} />}
              <TextField
                margin="dense"
                label={t("Address")}
                type="address"
                fullWidth
                name="address"
                value={newContact.address}
                onChange={handleInputChange}
              />
              {errors.address && <FormError error={errors.address} />}
              <Grid item xs={12} mb={2}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    {'Status'}
                  </InputLabel>
                  <Select
                    displayEmpty
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={newContact.status}
                    label="Status"
                    onChange={(event) => {
                      setnewContact((prevState) => ({
                        ...prevState,
                        status: event.target.value as string,
                      }));
                    }}
                  >
                    {Object.keys(contactStatus).map((unit) => {
                      return (
                        <MenuItem key={unit} value={unit}>
                          {contactStatus[unit as keyof typeof contactStatus]}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {errors.status && <FormError error={errors.status} />}
              </Grid>
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
                label={t('Save')}
                onClick={onSubmit}
                style={{
                  width: "150px",
                  fontSize: "1rem",
                  fontWeight: "700",
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
