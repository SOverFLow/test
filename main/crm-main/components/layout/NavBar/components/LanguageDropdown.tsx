import React, { useState } from "react";
import { Menu, MenuItem, Tooltip } from "@mui/material";
import { Language as LanguageIcon } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Box from "@mui/material/Box";
const StyledButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  "&:hover": {
    color: theme.palette.primary.dark,
  },
}));

const StyledMenu = styled(Menu)({});

const ALLLANGS = [
  {
    value: "en",
    label: "English",
    image: "/images/en.svg",
  },
  {
    value: "fr",
    label: "French",
    image: "/images/fr.svg",
  },
];

function LanguageDropdown() {
  const [currentPath, setCurrentPath] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const pathname = usePathname();
  const lang = useSelector((state: RootState) => state?.langSlice?.value);

  useEffect(() => {
    const index = pathname.indexOf(`/${lang}/`) + 4;
    const pathAfterLocale = pathname.slice(index);
    setCurrentPath(pathAfterLocale);
  }, [pathname, lang]);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
    <Tooltip title="Language">
      <StyledButton
        aria-label="show new notifications"
        color="inherit"
        onClick={handleClick}
      >
        <LanguageIcon />
      </StyledButton>
      </Tooltip>

      <StyledMenu
        id="language-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {ALLLANGS.map((languege) => (
          <Link href={`/${languege.value}/${currentPath}`} key={languege.value}>
            <MenuItem
              onClick={() => handleClose()}
              sx={{ typography: "body2", py: 1 }}
            >
              <Box
                component="img"
                alt={languege.label}
                src={languege.image}
                sx={{ width: 28, marginRight: 2 }}
              />

              {languege.label}
            </MenuItem>
          </Link>
        ))}
      </StyledMenu>
    </>
  );
}

export default LanguageDropdown;
