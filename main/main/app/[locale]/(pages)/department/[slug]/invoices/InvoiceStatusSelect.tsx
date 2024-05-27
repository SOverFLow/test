import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import { updateInvoiceStatus } from "./utils";

interface InvoiceStatusSelectProps {
  invoiceUid: string;
  defaultValue: string;
}

const InvoiceStatusSelect: React.FC<InvoiceStatusSelectProps> = ({
  invoiceUid,
  defaultValue,
}) => {
  const [status, setStatus] = useState(defaultValue);
  const handleChangeStatus = async (event: any, uid: string) => {
    setStatus(event.target.value);
    event.preventDefault();
    const data = await updateInvoiceStatus(uid, event.target.value.toLowerCase());
    if (data) {
      toast.success("Invoice status updated", {
        position: "bottom-right",
      });
    } else {
      toast.error("Invoice status update failed", {
        position: "bottom-right",
      });
    }
  };
  return (
    <FormControl sx={{minWidth: 100 }} size="small">
      <InputLabel id="status-select-label">Status</InputLabel>
      <Select
        labelId="status-select-label"
        id="status-select"
        value={status}
        label="Status"
        onChange={(event) => handleChangeStatus(event, invoiceUid)}
      >
        <MenuItem value="Paid">Paid</MenuItem>
        <MenuItem value="Pending">Pending</MenuItem>
      </Select>
    </FormControl>
  );
};

export default InvoiceStatusSelect;
