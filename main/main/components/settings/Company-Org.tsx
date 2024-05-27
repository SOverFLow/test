"use client";
import { Box, Grid, Tab, Tabs, useMediaQuery } from "@mui/material";
import React from "react";
import AccountantTab from "./Tabs/Company-Org/AccountantTab";
import OpeningHoursTab from "./Tabs/Company-Org/OpeningHoursTab";
import CompanyTab from "./Tabs/Company-Org/CompanyTab";
import TasksTab from "./Tabs/Company-Org/TasksTab";
import HourPricingTab from "./Tabs/Company-Org/HourPricingTab";
import { useTranslations } from "next-intl";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Grid
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Grid
          sx={{
            p: 3,
            width: "100%",
            display: "flex",
            alignItems: "left",
            flexDirection: "column",
          }}
        >
          {children}
        </Grid>
      )}
    </Grid>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function CompanyOrg() {
  const [value, setValue] = React.useState(0);
  const t = useTranslations("SettingsPage.CompanyTab");

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
  };

  return (
    <Grid
      container
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "scroll",

        padding: 0,
      }}
    >
      <Grid>
        <Grid
          // container
          sx={{
            height: "fit-content",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            overflow: "scroll",
          }}
        >
          {/* tabs header */}
          <Grid
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              width: "100%",
              overflow: "scroll",
              scrollbarWidth: "thin",
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                sx={{ textTransform: "none" }}
                label={t("company")}
                {...a11yProps(0)}
                disableRipple
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={t("opening-hours")}
                {...a11yProps(1)}
                disableRipple
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={t("accountant")}
                {...a11yProps(2)}
                disableRipple
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={t("tasks")}
                {...a11yProps(3)}
                disableRipple
              />
              <Tab
                sx={{ textTransform: "none" }}
                label={t("hour-pricing")}
                {...a11yProps(4)}
                disableRipple
              />
            </Tabs>
          </Grid>

          {/* tabs body */}
          <Grid>
            <CustomTabPanel value={value} index={0}>
              <CompanyTab />
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
              <OpeningHoursTab />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <AccountantTab />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <TasksTab />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
              <HourPricingTab />
            </CustomTabPanel>
          </Grid>
          <Grid />
        </Grid>
      </Grid>
    </Grid>
  );
}
