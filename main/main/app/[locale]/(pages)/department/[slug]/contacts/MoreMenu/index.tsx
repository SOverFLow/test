import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { lazy, Suspense, useState } from "react";
import { NiceLoading } from "@/components/ui/Loading/NiceLoading";
import { useTranslations } from "next-intl";
const EditContact = lazy(() => import("./EditContact"));
const DeleteContact = lazy(() => import("./DeleteContact"));

export default function MoreMenu({ contactData }: { contactData: any }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [openEditContact, setOpenEditContact] = useState(false);
  const [openDeleteContact, setOpenDeleteContact] = useState(false);
  const t = useTranslations("Contact");

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = () => {
    setOpenEditContact(true);
    setAnchorEl(null);
  };
  const handleDelete = () => {
    setOpenDeleteContact(true);
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
        <MenuItem onClick={handleEdit}>{t('Edit')}</MenuItem>
        <MenuItem onClick={handleDelete}>{t('Delete')}</MenuItem>
      </Menu>
      {openEditContact && (
        <Suspense fallback={<NiceLoading />}>
          <EditContact
            contactData={contactData}
            useDialogOpen={[openEditContact, setOpenEditContact]}
          />
        </Suspense>
      )}
      {openDeleteContact && (
        <Suspense fallback={<NiceLoading />}>
          <DeleteContact
            useDialogOpen={[openDeleteContact, setOpenDeleteContact]}
            contact_id={contactData.uid}
          />
        </Suspense>
      )}
    </>
  );
}
