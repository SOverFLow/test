"use client";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { open, close } from "@/store/loadingSlice";
import ConfermeInvoice from "./confirmInvoice";
import { toast } from "react-toastify";
import ConfirmationBadge from "./ConfirmationBadge";
import { Box, Typography } from "@mui/material";

export default function Confirm({
  params,
}: {
  params: { InvoiceID: string; slug: string; locale: string };
}) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    loading &&
      ConfermeInvoice(params.InvoiceID).then((res) => {
        const { data, error } = res;
        if (error) {
          toast.error(error);
        } else {
          toast.success(data);
          setSuccess(true);
        }
        setLoading(false);
      });
  }, [loading, params.InvoiceID]);
  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <ConfirmationBadge loading={loading} success={success} />
      <Typography>
        {success ? "Invoice has been confirmed!" : "Loading..."}
      </Typography>
    </Box>
  );
}
