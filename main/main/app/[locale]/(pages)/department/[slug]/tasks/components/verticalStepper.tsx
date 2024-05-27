"use client";
import { RootState } from "@/store";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";

export default function VerticalLinearStepper() {
  const t = useTranslations("AddTaskForm");
  const steps = [
    {
      label: t("Information general"),
    },
    {
      label: t("Time, location and client"),
    },
    {
      label: t("Workers and task status"),
    },
    {
      label: t("Consumubles and services"),
    },
    {
      label: t("dependency of task"),
    },
    {
      label: t("Selling Price"),
    },
    {
      label: t("Attachments"),
    },
  ];
  const activeStep = useSelector(
    (state: RootState) => state?.VerticalSteperSlice?.activeStep
  );
  const handleStep = (step: any) => () => {
    console.log(step);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        maxWidth: 300,
        border: "3px solid #00acc1",
        borderColor: "divider",
        borderRadius: "0.6rem",
        padding: 2,
        width: "100%",
        height: "fit-content",
        top: "11vh",
        right: 120,
        zIndex: 1000,
      }}
    >
      <Typography sx={{ marginBottom: 2, fontSize: "1rem", fontWeight: 550 }}>
        {t("New Task")}
      </Typography>

      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepButton onClick={handleStep(index)}>{step.label}</StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
