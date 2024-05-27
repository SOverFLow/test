import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { lazy, Suspense, useState } from "react";
import { NiceLoading } from "@/components/ui/Loading/NiceLoading";
import { useTranslations } from "next-intl";
const EditAmortization = lazy(() => import("./EditAmortization"));
const DeleteAmortization = lazy(() => import("./DeleteAmortization"));

export default function MoreMenu({
  amortizationData,
}: {
  amortizationData: any;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [openEditAmortization, setOpenEditAmortization] = useState(false);
  const [openDeleteAmortization, setOpenDeleteAmortization] = useState(false);
  const t = useTranslations("Amortization");

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = () => {
    setOpenEditAmortization(true);
    setAnchorEl(null);
  };
  const handleDelete = () => {
    setOpenDeleteAmortization(true);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ padding: "0" }}
      >
        <MoreVertIcon fontSize="inherit" />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleEdit}>{t('edit')}</MenuItem>
        <MenuItem onClick={handleDelete}>{t('delete')}</MenuItem>
      </Menu>
      {openEditAmortization && (
        <Suspense fallback={<NiceLoading />}>
          <EditAmortization
            amortizationData={amortizationData}
            useDialogOpen={[openEditAmortization, setOpenEditAmortization]}
          />
        </Suspense>
      )}
      {openDeleteAmortization && (
        <Suspense fallback={<NiceLoading />}>
          <DeleteAmortization
            useDialogOpen={[openDeleteAmortization, setOpenDeleteAmortization]}
            amortization_id={amortizationData.uid}
          />
        </Suspense>
      )}
    </>
  );
}
