import { Avatar, Box, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

// uid, username, first_name, last_name, avatar, email, phone
interface UserCardProps {
  uid: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  email: string;
  phone: string;
}

export default function UserCard({
  uid,
  first_name,
  last_name,
  avatar,
  email,
  phone,
}: UserCardProps) {
  const t = useTranslations("Task");
  return (
    <Paper
      elevation={2}
      sx={{
        width: "300px",
        minHeight: "100px",
        padding: ".4rem 1rem",
        display: "flex",
        alignItems: "center",
        gap: ".8rem",
      }}
    >
      <Avatar sx={{ width: "60px", height: "60px" }} src={avatar!} />
      <Box>
        <Typography variant="h5" fontSize={"1rem"}>
          {first_name} {last_name}
        </Typography>
        <Typography variant="h5" fontSize={".7rem"}>
          {t("Email")}: {email}
        </Typography>
        <Typography variant="h5" fontSize={".7rem"}>
          {t("Phone")}: {phone}
        </Typography>
      </Box>
    </Paper>
  );
}
