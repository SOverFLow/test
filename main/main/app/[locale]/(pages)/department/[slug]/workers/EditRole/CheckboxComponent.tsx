"use client";
import {
  AccessibilityNew,
  AdminPanelSettings,
  Assignment,
  AttachMoney,
  AttributionOutlined,
  Business,
  Comment,
  Contacts,
  Engineering,
  ErrorOutline,
  ExpandMore,
  HomeWork,
  Inventory,
  MoneyOff,
  People,
  PostAdd,
  PriorityHigh,
  Receipt,
  SupervisorAccount,
  Warehouse,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import React, { memo, useCallback, useState } from "react";

interface checkboxComponent {
  child: Record<string, any>;
  label: string;
  setSubmitData: (data: any) => void;
}

const iconForTable: Record<string, object> = {
  TVA: MoneyOff,
  Bien: HomeWork,
  Role: SupervisorAccount,
  Task: Assignment,
  Stock: Warehouse,
  Client: People,
  Status: PriorityHigh,
  Comment: Comment,
  Contact: Contacts,
  Invoice: Receipt,
  Product: Inventory,
  Department: Business,
  Supplier: AttributionOutlined,
  TaskCost: PostAdd,
  UserTable: AccessibilityNew,
  SuperAdmin: AdminPanelSettings,
  UserWorker: Engineering,
  DepartmentCost: AttachMoney,
  client_department: ErrorOutline,
  task_user_worker: ErrorOutline,
  department_user_worker: ErrorOutline,
};

const createState = (child: Record<string, any>) =>
  child && typeof child === "object" ? { ...child } : {};

const resetAllValuesToTrue = (
  state: Record<string, boolean>,
  value: boolean
): Record<string, boolean> =>
  Object.keys(state).reduce((acc, key) => ({ ...acc, [key]: value }), {});

const FormControlVar = memo(
  ({
    data,
    checked,
    onChange,
  }: {
    data: string;
    checked: boolean;
    onChange: (data: string) => void;
  }) => (
    <FormControlLabel
      label={data}
      control={<Checkbox checked={!!checked} onChange={() => onChange(data)} />}
    />
  )
);

FormControlVar.displayName = "FormControlVar";

export default function CheckboxComponent({
  child,
  label,
  setSubmitData,
}: checkboxComponent) {
  const [expanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState(createState(child));

  const handleChanged = useCallback(
    (name: string, value: boolean) => {
      setChecked((prev) => ({
        ...prev,
        [name]: value,
      }));
      setSubmitData((prev: any) => ({
        ...prev,
        [label]: {
          ...prev[label],
          [name]: value,
        },
      }));
    },
    [label, setSubmitData]
  );

  const handleChange = useCallback(
    (value: boolean) => {
      const resetedValue = resetAllValuesToTrue(checked, value);
      setChecked(resetedValue);
      setSubmitData((prev: any) => ({
        ...prev,
        [label]: {
          ...resetedValue,
        },
      }));
    },
    [checked, label, setSubmitData]
  );

  React.useEffect(() => {
    setChecked(createState(child));
  }, [child]);

  const allChecked = Object.values(checked).every(Boolean);
  const someChecked = Object.values(checked).some(Boolean);

  return (
    <Accordion
      expanded={expanded}
      sx={{
        boxShadow: "none",
        padding: "0px !important",
        margin: "0px !important",
      }}
    >
      <AccordionSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{
          padding: "0px !important",
          margin: "0px !important",
          height: "40px !important",
          minHeight: "40px !important",
        }}
        expandIcon={<div>{`${5}/${Object.keys(checked).length}`}<ExpandMore /></div>}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <FormControlLabel
          sx={{
            padding: "0px !important",
            margin: "0px !important",
            height: "20px !important",
            minHeight: "20px !important",
          }}
          label={""}
          control={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* {React.createElement(iconForTable[label] as React.ElementType, {
                sx: { margin: "0px 10px 0px 0px !important" },
              })} */}
              <Typography>{label}</Typography>
            </Box>
          }
        />
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControlLabel
            label={allChecked ? "Unselect All" : "Select All"}
            control={
              <Checkbox
                checked={allChecked}
                indeterminate={someChecked && !allChecked}
                onChange={(e) => handleChange(e.target.checked)}
                aria-label="Select All"
                input-props={{
                  "aria-label": "Checkbox",
                }}
              />
            }
          />
        </Box>
        <Grid container>
          {Object.keys(checked).map((data, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FormControlVar
                data={data}
                checked={checked[data]}
                onChange={() => handleChanged(data, !checked[data])}
              />
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
