"use client";
export default function Setting() {
  const t = useTranslations("SettingsPage");
  return (
    <div>
      <Typography
        variant="h3"
        sx={{ paddingBottom: "20px", display: { xs: "none", sm: "block" } }}
      >
        {t("setting")}
      </Typography>
      <VerticalTabs />
    </div>
  );
}
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";

import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab, { TabProps } from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button, Grid, TextField, alpha, styled } from "@mui/material";
import Profile from "@/components/settings/Profile";
import Password from "@/components/settings/Password";
import CompanyOrg from "@/components/settings/Company-Org";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import {
  AccountBoxOutlined,
  HttpsOutlined,
  SettingsOutlined,
  ShuffleOutlined,
} from "@mui/icons-material";
import { createClient } from "@/utils/supabase/client";
import Banks from "@/components/settings/Banks";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useTranslations } from "next-intl";
import { grey } from "@mui/material/colors";
import QCM from "@/components/settings/QCM";
import { getIfDepartmentIsFormation } from "../devis/[DevisID]/fetchUtils/fetchServerSide";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ height: "100%" }}
    >
      {value === index && <Box sx={{ height: "100%", p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const StyledTab = styled(Tab)<TabProps>(({ theme }) => ({
  textTransform: "none",
  minWidth: 0,
  position: "relative", // Needed for absolute positioning of the icon
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  // boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.2)",
  "&.Mui-selected": {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
  border: `1px solid transparent`,
  borderBottom: `2px solid ${alpha(theme.palette.primary.dark, 0.2)}`,
  "&:hover": {
    border: `1px solid ${theme.palette.primary.main}`,
    borderTop: `1px solid transparent`,
    borderBottom: `2px solid ` + grey[400],
    backgroundColor: theme.palette.action.hover,
  },
}));

const SettingsButton = ({
  content,
  name,
}: {
  content: string;
  name: string;
}) => {
  const sc = {
    position: { xs: "relative", sm: "absolute" },
    left: { xs: "0px", sm: "10px" },
  };
  const styledIcon: { [name: string]: JSX.Element } = {
    Company: <BusinessCenterOutlinedIcon sx={sc} />,
    Profile: <AccountBoxOutlined sx={sc} />,
    Password: <HttpsOutlined sx={sc} />,
    QCM: <DynamicFormIcon sx={sc} />,
    Bank: <AccountBalanceOutlinedIcon sx={sc} />,
    "*": <ShuffleOutlined sx={sc} />,
  };
  return (
    <Box
      sx={{
        overflowY: { xs: "none", sm: "auto" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {!styledIcon[name] ? styledIcon["*"] : styledIcon[name]}
      <Typography
        noWrap
        sx={{
          textOverflow: "ellipsis",
          width: "80%",
          textAlign: "start",
          display: { xs: "none", sm: "block" },
          paddingLeft: { sm: 2 }, // Add left padding on larger screens
        }}
      >
        {content}
      </Typography>
    </Box>
  );
};

function VerticalTabs() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const roleName = useSelector(
    (state: RootState) => state?.userSlice?.user?.user?.role
  );

  const param = useSearchParams();

  const t = useTranslations("SettingsPage.CompanyTab");
  const [isFormation, setIsFormation] = useState(false);
  const department = useSelector(
    (state: RootState) => state?.departmentSlice?.value
  );
  React.useEffect(() => {
    getIfDepartmentIsFormation(department?.uid).then((data) => {
      data && setIsFormation(data);
    });
  }, [department]);
  const getTabsToRender = (roleName: string) => {
    let tabsToRender = [
      {
        key: "Company",
        label: (
          <SettingsButton
            content={t("company-organization")}
            name={"Company"}
          />
        ),
        con: <CompanyOrg />,
        index: 0,
      },
      {
        key: "Bank",
        label: <SettingsButton content={t("banks-or-cash")} name={"Bank"} />,
        con: <Banks />,
        index: 1,
      },

      {
        key: "QCM",
        label: <SettingsButton content={"QCM"} name={"QCM"} />,
        con: <QCM />,
        index: 2,
      },
      {
        key: "Profile",
        label: <SettingsButton content={t("profile")} name={"Profile"} />,
        con: <Profile />,
        index: 3,
      },
      {
        key: "Password",
        label: <SettingsButton content={t("password")} name={"Password"} />,
        con: <Password />,
        index: 4,
      },
    ];
    if (roleName !== "super_admin") {
      // console.log("roleName", roleName);
      // console.log("tabsToRender", tabsToRender);
      // console.log("isFormation", isFormation);
      tabsToRender = tabsToRender.filter((tab) => tab.key !== "Company");
    }
    if (roleName !== "super_admin" || !isFormation) {
      tabsToRender = tabsToRender.filter((tab) => tab.key !== "QCM");
    }
    return tabsToRender;
  };

  const tabsToRender = getTabsToRender(roleName as string);

  React.useEffect(() => {
    const tab = param.get("tab");
    const tabIndex = tabsToRender.findIndex((t) => t.key === tab);
    if (tabIndex !== -1) {
      setValue(tabIndex);
      console.log(tabIndex);
    }
  }, [param, tabsToRender]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        height: { xs: "calc(100vh - 76px)", sm: "calc(100vh - 220px)" },
        width: "100%",
        maxWidth: "100dvw",
        border: (theme) =>
          `2px solid ${alpha(theme.palette.primary.dark, 0.2)}`,
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
        padding: "0px !important",
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{
          flexBasis: { xs: "15%", sm: "20%" },
          flexGrow: 0,
          flexShrink: 0,
          minWidth: "60px",
          maxWidth: "250px",
          borderColor: "divider",
          borderRight: (theme) =>
            `2px solid ${alpha(theme.palette.primary.dark, 0.2)}`,
          "& .MuiTabs-indicator": {
            width: "5px",
            borderRadius: "5px",
            left: 0,
          },
          "& .MuiTab-root": {
            paddingLeft: "20px", // Adjust as needed based on icon size
          },
          padding: "0px !important",
        }}
      >
        {tabsToRender.map((tab, index) => {
          return (
            <StyledTab label={tab.label} key={index} {...a11yProps(index)} />
          );
        })}
      </Tabs>
      <Box
        sx={{
          width: "calc(100% - 60px)",
          "& .MuiBox-root": {
            padding: "2px !important",
            paddingLeft: { xs: "0px", sm: "10px !important" },
          },
        }}
      >
        {tabsToRender.map((tab, index) => {
          return (
            <TabPanel value={value} index={index} key={index}>
              {tab.con}
            </TabPanel>
          );
        })}
      </Box>
    </Box>
  );
}
