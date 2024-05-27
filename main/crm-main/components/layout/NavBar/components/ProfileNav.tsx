"use client";
import { lazy } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
const LanguageDropdown = lazy(() => import("./LanguageDropdown"));
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  MenuItem,
  ListItemIcon,
  Button,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import FaceIcon from "@mui/icons-material/Face";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { setUser } from "@/store/userSlice";
import { signOut } from "@/app/[locale]/(auth)/styles/HandleSignClientSide";
import { AuthError } from "@supabase/supabase-js";
import { RootState } from "@/store";
import { useTranslations } from "next-intl";
import { setDepartment } from "@/store/departmentSlice";
import Link from "next/link";
import { getTablePermissionForSpecificRows } from "@/utils/fetchingWithRole";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const StyledButton = styled(IconButton)(({ theme }) => ({
  marginRight: "20px",
  color: theme.palette.primary.main,
  "&:hover": {
    color: theme.palette.primary.dark,
  },
}));

const IconButtons: React.FC = () => {
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const OPTIONS = [
    { label: "Profile", path: `/department/${departmentId}/profile` },
    { label: "Settings", path: `/department/${departmentId}/settings` },
  ];
  const theme = useTheme();
  const lang = useSelector((state: RootState) => state?.langSlice?.value);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [anchorElNotification, setAnchorElNotification] =
    React.useState<null | HTMLElement>(null);

  const handleOpenNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleCloseNotificationMenu = () => {
    setAnchorElNotification(null);
  };

  const [isClicked, setIsClicked] = React.useState(false);
  const [userImage, setUserImage] = React.useState<any>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state?.userSlice?.user);
  const rolename = useSelector(
    (state: RootState) => state?.userSlice?.user?.user?.role
  );

  const t = useTranslations("avatarMenuNavbar");

  const handleSignout = () => {
    setIsClicked(true);
    dispatch(setUser(null));
    dispatch(setDepartment(null));
    signOut()
      .then(({ error }: { error: AuthError | null }) => {
        console.log("error", error);
        if (!error) {
          console.log("success");
          dispatch(setUser(null));
          router.refresh();
        }
        console.log("signout");
      })
      .catch((e) => {
        console.log("error", e);
        setIsClicked(false);
      });
  };
  const notificationsNUmber = 4;

  const pathName = usePathname();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        let query;
        if (!user) return;
        const supabase = createClient();
        let { data: table, error: tableError } = await supabase.rpc(
          "get_user_table",
          {
            user_uid: user.user.id,
          }
        );
        if (tableError) {
          console.log("error: ", tableError);
        }

        if (rolename && table) {
          query = await getTablePermissionForSpecificRows(
            rolename as string,
            table as string,
            ["avatar"]
          );
          if (query == undefined) console.log("error: ", query);
          const { data, error } = await supabase
            .from(table as "SuperAdmin" | "UserWorker" | "Client")
            .select(query as string)
            .eq("uid", user.user.id)
            .single();

          setUserImage(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [rolename, user?.user?.id, user]);

  return (
    <Box sx={{ width: "100%", textAlign: "right", paddingRight: "15px" }}>
      <LanguageDropdown />

      {/* <StyledButton
        aria-label={`${notificationsNUmber} show new notifications`}
        onClick={handleOpenNotificationMenu}
      >
        <StyledBadge badgeContent={notificationsNUmber} color="warning">
          <NotificationsIcon />
        </StyledBadge>
      </StyledButton> */}

      {/* <Popover
        id="menu-appbar"
        anchorEl={anchorElNotification}
        open={Boolean(anchorElNotification)}
        onClose={handleCloseNotificationMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      > */}
      {/* <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {"Notifications"}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {"You have 2 unread messages"}
          </Typography>
        </Box> */}

      {/* <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleCloseNotificationMenu}
          sx={{ typography: "body2", color: "error.main", py: 1.5 }}
        >
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <NextLink
            href={"/en/dashboard"}
            style={{
              textDecoration: "none",
            }}
          >
            <Typography textAlign="center">Notification 1</Typography>
          </NextLink>
        </MenuItem>
        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleCloseNotificationMenu}
          sx={{ typography: "body2", color: "error.main", py: 1.5 }}
        >
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <NextLink
            href={"/en/dashboard"}
            style={{
              textDecoration: "none",
            }}
          >
            <Typography textAlign="center">Notification 1</Typography>
          </NextLink>
        </MenuItem>
        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleCloseNotificationMenu}
          sx={{ typography: "body2", color: "error.main", py: 1.5 }}
        >
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <NextLink
            href={"/en/dashboard"}
            style={{
              textDecoration: "none",
            }}
          >
            <Typography textAlign="center">Notification 1</Typography>
          </NextLink>
        </MenuItem>
      </Popover> */}

      <Tooltip title="profile">
        <IconButton
          onClick={handleOpenUserMenu}
          sx={{
            width: 27,
            height: 27,
            border: `1px solid ${theme.palette.primary.main}`,
            color: theme.palette.primary.main,
            "&:hover": {
              color: theme.palette.primary.dark,
              border: `2px solid ${theme.palette.primary.main}`,
            },
            marginLeft: "8px",
          }}
        >
          {/* <FaceIcon /> userData?.avatar ?? */}
          <Avatar
            alt="portrait"
            sx={{ width: 24, height: 24 }}
            src={userImage?.avatar ?? ""}
          ></Avatar>
        </IconButton>
      </Tooltip>

      <Popover
        id="menu-appbar"
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.user?.email?.slice(0, user?.user?.email.indexOf("@"))}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {user?.user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        {OPTIONS.map((option) => (
          <Link href={`/${lang}${option.path}`} key={option.label}>
            <MenuItem key={option.label} onClick={handleCloseUserMenu}>
              {option.label}
            </MenuItem>
          </Link>
        ))}

        <Divider sx={{ borderStyle: "dashed", marginBottom: "0 !important" }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{
            typography: "body2",
            color: "error.main",
            marign: 0,
            padding: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box sx={{ margin: 0 }}>
            <Button
              onClick={handleSignout}
              fullWidth
              sx={{
                mt: 2,
                mb: 2,
                bgcolor: "error.main",
                color: "#fff",
                ":hover": { bgcolor: "error.dark" },
              }}
              disabled={isClicked}
            >
              {t("log-out")}
            </Button>
          </Box>
          {isClicked && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ padding: 1 }}
            >
              <CircularProgress />
            </Box>
          )}
        </MenuItem>
      </Popover>
    </Box>
  );
};

export default IconButtons;
