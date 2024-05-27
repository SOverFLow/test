import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@mui/material";

interface Devis {
  id: string;
  startDate: string;
  title: string;
  amount: number;
  client: string;
  tva: string;
  uid: string;
  status: "Confirmed" | "Pending" | "Canceled" | string;
  currency: string;
}

const DevisModal = ({
  open,
  handleClose,
  devis,
  onSubmit,
}: {
  open: boolean;
  handleClose: () => void;
  devis: Devis;
  onSubmit: (formData: Devis) => void;
}) => {
  const [formData, setFormData] = useState<Devis>({ ...devis });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Duplicate Devis</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="title"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="startDate"
          label="StartDate"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.startDate}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="amount"
          label="Amount"
          type="number"
          fullWidth
          variant="outlined"
          value={formData.amount}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="client"
          label="Client"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.client}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="tva"
          label="Tva"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.tva}
          onChange={handleChange}
        />
        {/* Add more fields as necessary */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};
export default DevisModal;
