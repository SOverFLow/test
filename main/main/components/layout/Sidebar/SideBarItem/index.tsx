"use client";
import { RootState } from "@/store";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  styled,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

interface Props {
  title: string;
  icon: React.ReactNode;
  href: string;
  idDynamicHref?: boolean;
}

const StyledItemButton = styled(ListItemButton)(({ theme }) => ({
  gap: "0px",
  "&.Mui-selected": {
    color: theme.palette.primary.dark,
    backgroundColor: theme.palette.primary.light,
    ">.MuiListItemIcon-root": {
      color: theme.palette.primary.dark,
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
  "&:hover": {
    color: theme.palette.primary.dark,
    ">.MuiListItemIcon-root": {
      color: theme.palette.primary.dark,
    },
  },
}));

export default function SideBarItem({
  title,
  icon,
  href,
  idDynamicHref,
}: Props) {
  const lang = useSelector((state: RootState) => state?.langSlice?.value);
  const open = useSelector((state: RootState) => state?.menuSlice?.value);
  const departmentId = useSelector(
    (state: RootState) => state?.departmentSlice?.value?.uid
  );
  const pathName = usePathname();
  const fullPath = idDynamicHref
    ? `/${lang}/department/${departmentId}${href}`
    : `/${lang}${href}`;
  let styl = '0px !important';
  let sizeCon = '100%'
  if ((title == "Contract/Discount" || title == "Contrat/Remise") && open) {
    styl = '20px !important';
    sizeCon = 'calc(100% - 20px)';
  }
  return (
    <ListItem disablePadding sx={{ my: "6px", ml:`${styl}`,width:`${sizeCon}` }}>
      <Link href={fullPath} style={{ width: '100%' }} passHref legacyBehavior>
        <Tooltip
          disableHoverListener={open}
          disableInteractive
          title={title}
          placement="right"
        >
          <StyledItemButton
            selected={fullPath == pathName}
            sx={{ borderRadius: "10px" }}
          >
            <ListItemIcon sx={{minWidth: "40px"}}>{icon}</ListItemIcon>
            <ListItemText primary={title} />
          </StyledItemButton>
        </Tooltip>
      </Link>
    </ListItem>
  );
}
