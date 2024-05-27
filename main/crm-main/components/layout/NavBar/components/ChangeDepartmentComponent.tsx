"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import {
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Box,
  Divider,
  TextField,
  TypographyProps,
  MenuItemProps,
  InputAdornment,
  TextFieldProps,
  IconButtonProps,
  Button,
  Grid,
} from "@mui/material";
import {
  Business,
  AddCircleOutline,
  ArrowDropUp,
  ArrowDropDown,
  Check,
  Search,
  ErrorOutline,
} from "@mui/icons-material";
import { createClient } from "@/utils/supabase/client";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import WrapperCreateDepartment from "@/app/[locale]/(pages)/department/CreateDepartment/WrapperCreateDepartment";
import { useTranslations } from "next-intl";
import DeleteDepartmentButton from "./DeleteDepartmentButton";

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    width: "350px",
    maxHeight: "400px",
  },
  "& .MuiMenu-list": {
    padding: "0px",
  },
  marginTop: "5px",
}));

const StyledIconButton = styled(IconButton)<IconButtonProps>({
  borderRadius: "0%",
  maxWidth: "250px",
});

const StyledTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  margin: 0,
  "& .MuiOutlinedInput-root": {
    borderRadius: "3px",
  },
  "& .MuiInputBase-input": {
    paddingLeft: "0px",
  },
}));

const TruncatedTypography = styled(Typography)<TypographyProps>({
  textOverflow: "ellipsis",
});

const StyledMenuItem = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const supabase = createClient();

export default function ChangeDepartmentComponent() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const t = useTranslations("departmentMenu");
  const [selectedOrg, setSelectedOrg] = useState(t("no-department-selected"));
  const [searchQuery, setSearchQuery] = useState("");
  const [organizations, setOrganizations] = useState(
    null as
      | {
          created_at: string;
          id: number;
          super_admin_id: string;
          title: string;
          uid: string;
          updated_at: string;
        }[]
      | null
  );
  const open = Boolean(anchorEl);
  const selected = useSelector(
    (state: RootState) => state?.departmentSlice?.value
  );
  const lang = useSelector((state: RootState) => state?.langSlice?.value);
  useEffect(() => {
    const supabase = createClient();
    const productChanel = supabase
      .channel("productChanel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Department" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setOrganizations(
              (prev) =>
                prev?.filter((org) => org?.uid !== payload.old?.uid) || null
            );
          }
          if (payload.eventType === "INSERT") {
            setOrganizations((prev) => {
              const dataToInsert = {
                created_at: payload.new.created_at,
                id: payload.new.id,
                super_admin_id: payload.new.super_admin_id,
                title: payload.new.title,
                uid: payload.new.uid,
                updated_at: payload.new.updated_at,
              };
              return prev ? [...prev, dataToInsert] : [dataToInsert];
            });
          }
        }
      )
      .subscribe();

    if (selected?.uid && selected?.uid !== "none")
      setSelectedOrg(selected?.name);
    if (!selected?.uid || selected?.uid === "none")
      setSelectedOrg(t("no-department-selected"));
    return () => {
      productChanel.unsubscribe();
    };
  }, [selected, selectedOrg, t]);
  const filteredOrganizations = useMemo(
    () =>
      organizations?.filter((org) =>
        org.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) || null,
    [searchQuery, organizations] // Recalculate if searchQuery or organizations change
  );

  const fetchDepartments = useCallback(async () => {
    const { data, error } = await supabase.from("Department").select("*");
    if (error) {
      console.error("Error fetching Department", error);
      return;
    }
    if (data) setOrganizations(data);
  }, []);

  const handleClickFetchDepartment = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
    if (!organizations) fetchDepartments();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (name: string) => {
    setSelectedOrg(name);
    handleClose();
  };

  const handleSearchChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box>
      <StyledIconButton
        aria-label={selectedOrg}
        onClick={handleClickFetchDepartment}
      >
        <Business />
        <TruncatedTypography
          variant="subtitle1"
          noWrap
          sx={{ display: { xs: "none", md: "block" }, height: "24px" }}
        >
          {selectedOrg}
        </TruncatedTypography>
        {open ? <ArrowDropUp /> : <ArrowDropDown />}
      </StyledIconButton>
      <OrganizationMenuDropdown
        open={open}
        lang={lang}
        selectedOrg={selectedOrg}
        searchQuery={searchQuery}
        anchorEl={anchorEl}
        onClose={handleClose}
        onMenuItemClick={handleMenuItemClick}
        onSearchChange={handleSearchChange}
        organizationsToShow={filteredOrganizations}
        t={t}
      />
    </Box>
  );
}

function OrganizationMenuDropdown({
  open,
  lang,
  selectedOrg,
  searchQuery,
  anchorEl,
  onClose,
  onMenuItemClick,
  onSearchChange,
  organizationsToShow,
  t,
}: {
  open: boolean;
  lang: string;
  selectedOrg: string;
  searchQuery: string;
  anchorEl: null | HTMLElement;
  onClose: () => void;
  onMenuItemClick: (name: string) => void;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  organizationsToShow:
    | {
        created_at: string;
        id: number;
        super_admin_id: string;
        title: string;
        uid: string;
        updated_at: string;
      }[]
    | null;
  t: (key: string) => string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSearchKeyDown = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
  };

  const handleOpenDialog = () => {
    setDialogOpen((prev) => !prev);
  };

  return (
    <StyledMenu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      onClose={onClose}
    >
      <StyledTextField
        fullWidth
        variant="outlined"
        placeholder={t("search-department-place-holder")}
        value={searchQuery}
        onChange={onSearchChange}
        onKeyDown={handleSearchKeyDown}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      <Divider />
      <Grid
        container
        sx={{ maxHeight: "200px", overflowY: "auto", paddingTop: "2px" }}
      >
        {organizationsToShow?.length === 0 ? (
          <MenuItem
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ErrorOutline sx={{ paddingRight: "4px" }} />
            <TruncatedTypography variant="subtitle1" noWrap>
              {t("no-department-found")}
            </TruncatedTypography>
          </MenuItem>
        ) : (
          organizationsToShow?.map((org, index: number) => (
            <Grid item xs={12} key={index}>
              <StyledMenuItem
                key={index}
                selected={org.title === selectedOrg}
                onClick={() => onMenuItemClick(org.title)}
              >
                <Grid item xs={11}>
                  <Link
                    href={`/${lang}/department/${org.uid}/dashboard`}
                    key={index}
                    passHref
                    legacyBehavior
                  >
                    <Grid container>
                      <Grid item xs={11}>
                        <TruncatedTypography variant="subtitle1" noWrap>
                          {org.title}
                        </TruncatedTypography>
                      </Grid>
                      <Grid item xs={1}>
                        {org.title === selectedOrg && <Check />}
                      </Grid>
                    </Grid>
                  </Link>
                </Grid>
                {/* <DeleteDepartmentButton departmentId={org.uid} /> */}
              </StyledMenuItem>
            </Grid>
          ))
        )}
      </Grid>
      {/* <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "10px",
        }}
      >
        <Button onClick={handleOpenDialog} sx={{ bgcolor: "inherit" }}>
          <Typography
            variant="body2"
            component="div"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AddCircleOutline sx={{ paddingRight: "4px" }} />
            {t("create-a-new-department")}
          </Typography>
        </Button>
        <Grid>
          <WrapperCreateDepartment
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            fromMenu={1}
          />
        </Grid>
      </Box> */}
    </StyledMenu>
  );
}
