import EmailIcon from "@mui/icons-material/Email";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";

export const renderIcon = (icon: any) => {
  if (icon == "EmailIcon") return <EmailIcon />;
  else if (icon == "FavoriteIcon") return <FavoriteIcon />;
  else if (icon == "HomeIcon") return <HomeIcon />;
  else if (icon == "SchoolIcon") return <SchoolIcon />;
  else if (icon == "WorkIcon") return <WorkIcon />;
};
