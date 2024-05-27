import { useTranslations } from "next-intl";
import { SyntheticEvent, useMemo, useState } from "react";
import UserProfile from "../../../components/profile";
import Permissions from "../permissions/Permissions";
import HrAndBank from "../Hr&Bank";
import { Box, Tab, TabProps, Tabs, alpha, styled } from "@mui/material";
import { SettingsButton, TabPanel } from "./ComponentForVerticalTab";

const StyledTab = styled(Tab)<TabProps>(({ theme }) => ({
  textTransform: "none",
  minWidth: 0,
  position: "relative", // Needed for absolute positioning of the icon
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.2)",
  border: `0.5px dashed transparent`,
  "&.Mui-selected": {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
  "&:hover": {
    border: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.action.hover,
  },
}));

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const VerticalTabs = ({
  userId,
  userRole,
  slug,
}: {
  userId: string;
  userRole: string;
  slug: string;
}) => {
  const [value, setValue] = useState(0);
  const t = useTranslations("Profile");
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabsToRender = useMemo(() => {
    if (userRole == "client")
      return [
        {
          label: <SettingsButton content={t("User Profile")} />,
          con: <UserProfile propUserId={userId} slug={slug} />,
        },
        {
          label: <SettingsButton content={t("Hr and Bank")} />,
          con: <HrAndBank userId={userId} slug={slug} />,
        },
      ];
    else
      return [
        {
          label: <SettingsButton content={t("User Profile")} />,
          con: <UserProfile propUserId={userId} slug={slug} />,
        },
        {
          label: <SettingsButton content={t("permissions")} />,
          con: <Permissions userId={userId} userRole={userRole} slug={slug} />,
        },
        {
          label: <SettingsButton content={t("Hr and Bank")} />,
          con: <HrAndBank userId={userId} slug={slug} />,
        },
      ];
  }, [t,userRole, userId, slug]);

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        width: "100%",
        border: (theme) =>
          `2px solid ${alpha(theme.palette.primary.dark, 0.2)}`,
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
        padding: "0px !important",
      }}
    >
      <Tabs
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {tabsToRender.map((tab, index) => (
          <StyledTab label={tab.label} key={index} {...a11yProps(index)} />
        ))}
      </Tabs>
      <Box sx={{}}>
        {tabsToRender.map((tab, index) => (
          <TabPanel value={value} index={index} key={index}>
            {tab.con}
          </TabPanel>
        ))}
      </Box>
    </Box>
  );
};

export default VerticalTabs;
