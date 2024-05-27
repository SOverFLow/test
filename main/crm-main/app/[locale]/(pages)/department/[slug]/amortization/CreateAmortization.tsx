"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";
import { toast } from "react-toastify";
import { TextField } from "@mui/material";
import { FormError } from "@/components/ui/FormError/FormError";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import "react-phone-input-2/lib/material.css";
import {
  AmortizationPayload,
  createAmortization,
} from "./utils/fetchClientAmortization";
import { amortizationSchema } from "@/utils/schemas/amortization/amortizationSchema";
import { inputDataAmortization } from "./utils/formSchema";
import { useTranslations } from "next-intl";

export default function CreateAmortization() {
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const [FormOpen, setFormOpen] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const t = useTranslations("Amortization");

  const [newAmortization, setnewAmortization] = useState<{
    [key: string]: number | string;
  }>({
    accumulated_depreciation: 0,
    book_value: 0,
    depreciation_installment: 0,
    first_year_useful_life: 0,
    last_year_useful_life: 0,
    net_book: 0,
    number_of_years_of_depreciation: 0,
    value_of_the_asset: 0,
    year: 0,
    start_date_of_the_fiscal_year: "",
    acquisition_date: "",
  });

  const handleOpenForm = () => {
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
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
      createAmortization(allData as AmortizationPayload)
        .then(() => {
          toast.success(t('success'), {
            position: "bottom-right",
          });
          setErrors({});
        })
        .catch((error) => {
          toast.error(
            t('error'),
            {
              position: "bottom-right",
            }
          );
        });
      setnewAmortization({
        accumulated_depreciation: 0,
        acquisition_date: "",
        book_value: 0,
        depreciation_installment: 0,
        first_year_useful_life: 0,
        last_year_useful_life: 0,
        net_book: 0,
        number_of_years_of_depreciation: 0,
        start_date_of_the_fiscal_year: "",
        value_of_the_asset: 0,
        year: 0,
      });
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
      <Box sx={{ marginBottom: "8px" }}>
        <CustumButton
          label={
            <>
              <AddIcon />
              {t('Create')}
            </>
          }
          onClick={handleOpenForm}
        />
      </Box>

      <Box display={FormOpen ? "block" : "none"}>
        {inputDataAmortization.map((inputField) => (
          <div key={inputField.name} className="form-input-container">
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
        <Box display={"flex"} sx={{ gap: "4px", marginTop: "8px" }}>
          <CustumButton label={t('close')} onClick={handleCloseForm} />
          <CustumButton label={t('Save')} onClick={onSubmit} />
        </Box>
      </Box>
    </Box>
  );
}
