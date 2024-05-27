"use client";
import {
  AppBar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import "react-phone-input-2/lib/material.css";
import { FormError } from "@/components/ui/FormError/FormError";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import Close from "@mui/icons-material/Close";
import { Amortization } from "../utils/types";
import {
  AmortizationPayload,
  updateAmortization,
} from "../utils/fetchClientAmortization";
import { amortizationSchema } from "@/utils/schemas/amortization/amortizationSchema";
import { inputDataAmortization } from "../utils/formSchema";
import theme from "@/styles/theme";
import { useTranslations } from "next-intl";

interface EditAmortizationProps {
  amortizationData: Amortization;
  useDialogOpen: [boolean, (value: boolean) => void];
}

export default function EditAmortization({
  amortizationData,
  useDialogOpen,
}: EditAmortizationProps) {
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const [dialogOpen, setDialogOpen] = useDialogOpen;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const t = useTranslations("Amortization");

  const [newAmortization, setnewAmortization] = useState<{
    [key: string]: number | string;
  }>({
    accumulated_depreciation: amortizationData.accumulated_depreciation ?? "",
    acquisition_date: amortizationData.acquisition_date ?? "",
    book_value: amortizationData.book_value ?? "",
    depreciation_installment: amortizationData.depreciation_installment ?? "",
    first_year_useful_life: amortizationData.first_year_useful_life ?? "",
    last_year_useful_life: amortizationData.last_year_useful_life ?? "",
    net_book: amortizationData.net_book ?? "",
    number_of_years_of_depreciation:
      amortizationData.number_of_years_of_depreciation ?? "",
    start_date_of_the_fiscal_year:
      amortizationData.start_date_of_the_fiscal_year ?? "",
    value_of_the_asset: amortizationData.value_of_the_asset ?? "",
    year: amortizationData.year ?? "",
  });

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (
      name === "value_of_the_asset" ||
      name === "accumulated_depreciation" ||
      name === "book_value" ||
      name === "depreciation_installment" ||
      name === "first_year_useful_life" ||
      name === "last_year_useful_life" ||
      name === "net_book" ||
      name === "number_of_years_of_depreciation" ||
      name === "year"
    ) {
      setnewAmortization((prevState) => ({
        ...prevState,
        [name]: parseFloat(value),
      }));
      return;
    }
    setnewAmortization((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = () => {
    const returnvalue = amortizationSchema.safeParse(newAmortization);
    if (returnvalue.success) {
      const allData = { ...newAmortization, department_id: departmentId };
      updateAmortization(allData as AmortizationPayload, amortizationData.uid);
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
    }
  };

  return (
    <Box>
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
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "space-between",
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
              }}
            >
              {t("Edit")}
            </Typography>
            <CustumButton label={t('Save')} onClick={onSubmit} />
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Grid
            container
            sx={{ width: "30rem", height: "23rem", maxWidth: "100%" }}
          >
            <Grid item md={12} xs={12}>
              {inputDataAmortization.map((inputField) => (
                <div key={inputField.name}>
                  <TextField
                    margin="dense"
                    label={inputField.label}
                    type={inputField.type || "text"}
                    fullWidth
                    name={inputField.name}
                    value={newAmortization[inputField.name] as string | number}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  {errors[inputField.name] && (
                    <FormError error={errors[inputField.name]} />
                  )}
                </div>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
