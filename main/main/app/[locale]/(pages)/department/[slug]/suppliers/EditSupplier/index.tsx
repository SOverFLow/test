"use client";
import React, { useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import EditIcon from "@mui/icons-material/Edit";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Toast } from "@/components/ui/Toast/Toast";
import theme from "@/styles/theme";
import { FormError } from "@/components/ui/FormError/FormError";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { getSupplierData } from "./utils";
import { SupplierSchema } from "@/utils/schemas/supplier/supplierSchema";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import Close from "@mui/icons-material/Close";

import { AddButtonForm } from "@/components/ui/Button/AddButtonForm";
import { Fax, LocalShippingOutlined } from "@mui/icons-material";
import SupplierDetails from "../CreateSupplier/SupplierDetails";
import { useTranslations } from "next-intl";

interface EditSupplierProps {
  supplierId: number | string;
}

export default function EditSupplier(props: EditSupplierProps) {
  const supabase = createClient();
  const t = useTranslations("Supplier");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [bgcolor, setBgcolor] = useState("");

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
    cuurency: "",
    supplier_type: "",
    profesional_id: "",
    supplier_category: "",
    fax: "",
    tva: 0,
    bank_account: "",
  });

  useMemo(() => {
    if (props.supplierId) {
      getSupplierData(props.supplierId)
        .then((data) => {
          // console.log("getSupplierData: ", data);

          setNewSupplier(
            data as {
              name: string;
              phone_number: string;
              email: string;
              zip_code: string;
              city: string;
              state_province: string;
              address: string;
              country: string;
              website: string;
              cuurency: any;
              supplier_type: any;
              profesional_id: string;
              supplier_category: string;
              tva: number;
              bank_account: string;
              fax: string;
            }
          );
        })
        .catch((error) => console.error(error));
    }
  }, [props.supplierId]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewSupplier((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    // console.log(newSupplier);
    const returnvalue = SupplierSchema.safeParse(newSupplier);
    // console.log("returnvalue", returnvalue);
    if (returnvalue.success) {
      try {
        const { data, error } = await supabase
          .from("Supplier")
          .update({
            name: newSupplier.name,
            phone_number: newSupplier.phone_number,
            email: newSupplier.email,
            address: newSupplier.address,
            city: newSupplier.city,
            country: newSupplier.country,
            state_province: newSupplier.state_province,
            zip_code: newSupplier.zip_code,
            website: newSupplier.website,
            cuurency: newSupplier.cuurency as any,
            supplier_type: newSupplier.supplier_type as any,
            profesional_id: newSupplier.profesional_id,
            supplier_category: newSupplier.supplier_category,
            tva: newSupplier.tva,
            bank_account: newSupplier.bank_account,
            fax: newSupplier.fax,
          })
          .eq("uid", props.supplierId)
          .select();
        console.log("****data", data);
        if (error) {
          console.log("error", error);
          throw error;
        }

        setMessage("Supplier Edited successfully");
        setBgcolor(theme.palette.success.main);
        setOpen(true);
        setErrors({});
      } catch (error) {
        setMessage("Error Editing Supplier");
        setBgcolor(theme.palette.error.main);
        setOpen(true);
      }

      setDialogOpen(false);
    } else {
      returnvalue.error.issues.reduce(
        (acc: any, issue: any) => {
          acc[issue.path[0]] = issue.message;
          console.log("acc", acc);
          setErrors(acc);
          return acc;
        },
        {} as Record<string, string>
      );
    }
  };

  return (
    <>
      <Toast
        message={message}
        backgroundColor={bgcolor}
        open={open}
        setOpen={setOpen}
      />
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
            title="edit supplier"
          >
            <EditIcon />
          </Button>
        </Box>

        <Dialog open={dialogOpen} onClose={handleCloseDialog} fullScreen>
          <AppBar sx={{ position: "relative" }}>
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
                sx={{
                  marginLeft: "1rem",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                  transition: "all 0.3s",
                }}
              >
                <Close
                  sx={{
                    transition: "all 0.3s",
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "white",
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              </IconButton>

              <Typography
                sx={{
                  marginLeft: "1rem",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "white",
                }}
              >
                {t("edit-supplier")}
              </Typography>

              <DialogActions>
                <CustumButton
                  style={{
                    // px: "1.5rem",
                    // py: "0.5rem",
                    backgroundColor: "white",
                    color: theme.palette.primary.main,
                  }}
                  label={t("save")}
                  onClick={onSubmit}
                />
              </DialogActions>
            </Toolbar>
          </AppBar>
          <DialogContent>
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
                    {t("edit-supplier")}
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
                  {t("general-information")}
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
                  {t("supplier-third-party-name")}
                </Typography>
              </Grid>

              <Grid item md={12} xs={12}>
                <TextField
                  margin="dense"
                  placeholder={t("name")}
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
                    {t("phone-number")}
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
                  placeholder={t("phone-number")}
                  specialLabel=""
                  inputStyle={{
                    width: "100%",
                    margin: "4px 0px",
                    backgroundColor: "#f5f5f5",
                  }}
                />

                {errors.phone_number && (
                  <FormError error={errors.phone_number} />
                )}

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
                    {t("e-mail-address")}
                  </Typography>
                </Grid>

                <TextField
                  autoFocus
                  margin="dense"
                  placeholder={t("email")}
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
                    {t("supplier-third-party-website")}
                  </Typography>
                </Grid>

                <TextField
                  autoFocus
                  margin="dense"
                  placeholder={t("website")}
                  type="text"
                  fullWidth
                  name="website"
                  value={newSupplier.website} // a chanegere ici
                  onChange={handleInputChange}
                />
                {errors.website && <FormError error={errors.website} />}
                <SupplierDetails
                  newSupplierData={newSupplier}
                  setNewSupplierData={setNewSupplier}
                  SupplierErrors={errors}
                />
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
}
