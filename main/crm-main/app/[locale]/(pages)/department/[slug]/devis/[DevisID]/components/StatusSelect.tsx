import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { updateDevisStatus } from "../../../invoices/utils";
import { toast } from "react-toastify";

interface StatusSelectProps {
  devisUid: string;
  defaultValue: string;
}

const StatusSelect: React.FC<StatusSelectProps> = ({
  devisUid,
  defaultValue,
}) => {
  const [status, setStatus] = useState(defaultValue);
  const handleChangeStatus = async (event: any, uid: string) => {
    setStatus(event.target.value);
    event.preventDefault();
    const data = await updateDevisStatus(uid, event.target.value);
    if (data) {
      toast.success("Devis status updated", {
        position: "bottom-right",
      });
    } else {
      toast.error("Devis status update failed", {
        position: "bottom-right",
      });
    }
  };
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="status-select-label">Status</InputLabel>
      <Select
        labelId="status-select-label"
        id="status-select"
        value={status}
        label="Status"
        onChange={(event) => handleChangeStatus(event, devisUid)}
      >
        <MenuItem value="Confirmed">Confirmed</MenuItem>
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="Canceled">Canceled</MenuItem>
      </Select>
    </FormControl>
  );
};

export default StatusSelect;
