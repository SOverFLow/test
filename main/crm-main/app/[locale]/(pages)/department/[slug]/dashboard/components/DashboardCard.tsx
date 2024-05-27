import {
  AccountCircle,
  MonetizationOn,
  SupervisorAccount,
} from "@mui/icons-material";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";
import { SxProps } from "@mui/system";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: string | "money" | "workers" | "clients" | "sales";
}

const cardStyle: SxProps = {
  display: "flex",
  padding: "0px 8px",
  justifyContent: "center",
  boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
  borderRadius: 2,
  "&&:hover": {
    backgroundColor: "#f5f5f5",
    transition: "0.5s",
  },
  height: "80px",
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
}) => {
  const theme = useTheme();
  const iconColor = (iconType: string) => {
    switch (iconType) {
      case "money":
        return theme.palette.success.main;
      case "workers":
        return theme.palette.error.main;
      case "clients":
        return theme.palette.warning.main;
      case "sales":
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const renderIcon = (iconType: string) => {
    const color = iconColor(iconType);
    switch (iconType) {
      case "money":
        return <MonetizationOn sx={{ color, fontSize: "40px" }} />;
      case "workers":
        return <SupervisorAccount sx={{ color, fontSize: "40px" }} />;
      case "clients":
        return <AccountCircle sx={{ color, fontSize: "40px" }} />;
      case "sales":
        return <ShoppingCart sx={{ color, fontSize: "40px" }} />;
      default:
        return null;
    }
  };
  return (
    <Card sx={{ ...cardStyle }}>
      <Box sx={{ fontSize: 60 }}>{renderIcon(icon)}</Box>
      <CardContent>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
