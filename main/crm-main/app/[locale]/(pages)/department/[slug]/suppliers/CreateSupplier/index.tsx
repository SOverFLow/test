"use client";
import { RootState } from "@/store";
import { createClient } from "@/utils/supabase/client";
import AddIcon from "@mui/icons-material/Add";
import {
  AppBar,
  Box,
  Divider,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { useSelector } from "react-redux";

import { Dialog, DialogContent, TextField } from "@mui/material";

import { CustumButton } from "@/components/ui/Button/CustumButton";
import { FormError } from "@/components/ui/FormError/FormError";
import { Toast } from "@/components/ui/Toast/Toast";
import theme from "@/styles/theme";
import { SupplierSchema } from "@/utils/schemas/supplier/supplierSchema";

import { LocalShippingOutlined } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import SupplierDetails from "./SupplierDetails";

interface props {
  openSteper?: () => void;
  showText?: boolean;
}

export default function CreateSupplier({ openSteper, showText = true }: props) {
  const supabase = createClient();
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [bgcolor, setBgcolor] = useState("");
  const t = useTranslations("CreateSupplier");

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    phone_number: "",
    email: "",
    zip_code: "",
    city: "",
    state_province: "",
    address: "",
    country: "",
    website: "",
    cuurency: undefined,
    supplier_type: undefined,
    profesional_id: "",
    supplier_category: "",
    tva: 0,
    bank_account: "",
  });

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewSupplier((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    const returnvalue = SupplierSchema.safeParse(newSupplier);
    if (returnvalue.success) {
      const allData = { ...newSupplier, department_id: departmentId };
      try {
        const { data, error } = await supabase
          .from("Supplier")
          .insert(allData)
          .select();
        if (error) {
          console.log("error", error);
          throw error;
        }
        console.log("data", data);
        toast.success(t("Supplier Added successfully"), {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
        setErrors({});
      } catch (error) {
        toast.error(t("Error submitting Supplier"), {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      }

      setNewSupplier({
        name: "",
        phone_number: "",
        email: "",
        zip_code: "",
        city: "",
        state_province: "",
        address: "",
        country: "",
        website: "",
        cuurency: undefined,
        supplier_type: undefined,
        profesional_id: "",
        supplier_category: "",
        tva: 0,
        bank_account: "",
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
      toast.error(t("Please fill all required fields"), {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
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
              {showText && t("Create New Supplier")}
            </>
          }
          onClick={handleOpenDialog}
        />
        <Toast
          message={message}
          backgroundColor={bgcolor}
          open={open}
          setOpen={setOpen}
        />
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullScreen
        autoFocus={true}
      >
        <AppBar
          sx={{
            position: "relative",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "space-between",
            }}
          >
            <IconButton
              onClick={handleCloseDialog}
              edge="start"
              color="inherit"
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
              }}
            >
              {t("Create New Supplier")}
            </Typography>

            <Box
              sx={{ display: "flex", gap: "1rem", marginRight: "1rem" }}
            ></Box>
          </Toolbar>
        </AppBar>
        <DialogContent autoFocus={true}>
          <TextField
            select={true}
            autoFocus={true}
            sx={{
              width: "0%",
              height: "0%",
              opacity: "0",
            }}
          ></TextField>
          <Grid
            container
            sx={{
              width: "60rem",
              overflow: "auto",
              overflowX: "hidden",
              overflowY: "auto",
              maxWidth: "100%",
              marginLeft: { xs: "0rem", lg: "2rem" },
            }}
          >
            <Grid item md={12} xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  marginBottom: "1rem",
                  gap: "1rem",
                }}
              >
                <LocalShippingOutlined
                  sx={{ fontSize: "2rem", color: theme.palette.primary.main }}
                />
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: "550",
                    color: theme.palette.text.primary,
                  }}
                >
                  {t("Create New Supplier")}
                </Typography>
              </Box>
            </Grid>

            <Grid item md={12} xs={12}>
              <Typography
                sx={{
                  fontWeight: 550,
                  fontSize: "1.2rem",
                  color: "#222222",
                  display: "flex",
                  alignItems: "end",
                }}
              >
                {t("General Information")} :
              </Typography>
              <Divider
                sx={{
                  marginTop: "1rem",
                  marginBottom: "1rem",
                  width: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                }}
              />
            </Grid>

            <Grid item md={12} xs={12}>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: "#222222",
                  display: "flex",
                  alignItems: "end",
                }}
              >
                {t("Supplier or Third party name")}
              </Typography>
            </Grid>

            <Grid item md={12} xs={12}>
              <TextField
                margin="dense"
                placeholder={"name"}
                type="text"
                fullWidth
                name="name"
                value={newSupplier.name}
                onChange={handleInputChange}
              />

              {errors.name && <FormError error={errors.name} />}

              <Grid item md={12} xs={12} marginTop={"0.8rem"}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "1rem",
                    color: "#222222",
                    display: "flex",
                    alignItems: "end",
                  }}
                >
                  {t("Phone Number")}
                </Typography>
              </Grid>

              <PhoneInput
                country={"fr"}
                value={newSupplier.phone_number}
                onChange={(phone: string) =>
                  handleInputChange({
                    target: { name: "phone_number", value: phone },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                placeholder="Phone Number"
                specialLabel=""
                inputStyle={{
                  width: "100%",
                  margin: "4px 0px",
                  backgroundColor: "#f5f5f5",
                }}
              />

              {errors.phone_number && <FormError error={errors.phone_number} />}

              <Grid item md={12} xs={12} marginTop={"0.8rem"}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "1rem",
                    color: "#222222",
                    display: "flex",
                    alignItems: "end",
                  }}
                >
                  {t("E-mail Address")}
                </Typography>
              </Grid>

              <TextField
                autoFocus
                margin="dense"
                placeholder={"email"}
                type="email"
                fullWidth
                name="email"
                value={newSupplier.email}
                onChange={handleInputChange}
              />

              {errors.email && <FormError error={errors.email} />}

              <Grid item md={12} xs={12} marginTop={"0.8rem"}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "1rem",
                    color: "#222222",
                    display: "flex",
                    alignItems: "end",
                  }}
                >
                  {t("Supplier or third party Website")}
                </Typography>
              </Grid>

              <TextField
                autoFocus
                margin="dense"
                placeholder={"website"}
                type="text"
                fullWidth
                name="website"
                value={newSupplier.website} // a chanegere ici
                onChange={handleInputChange}
              />

              <SupplierDetails
                newSupplierData={newSupplier}
                setNewSupplierData={setNewSupplier}
                SupplierErrors={errors}
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
            >
              <CustumButton
                label={"Save"}
                onClick={onSubmit}
                style={{
                  width: "25%",
                  fontSize: "1.2rem",
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
