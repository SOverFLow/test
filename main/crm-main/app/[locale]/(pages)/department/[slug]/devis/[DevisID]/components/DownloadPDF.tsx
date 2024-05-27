"use client";

import React, { FC } from "react";
import { Invoice } from "../data/types";
import { useDebounce } from "@uidotdev/usehooks";
import DevisPage from "./DevisPage";
import dynamic from "next/dynamic";
import { Button, CircularProgress, Box } from "@mui/material";
import addInvoiceToBucket from "../fetchUtils/addInvoiceToBucket";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import sendInvoiceMail from "@/utils/sendMail";
import { toast } from "react-toastify";
import Attestation from "./Attestation";
import ConventionPage from "./ConventionPage";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <CircularProgress />,
  }
);

const BlobProvider = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.BlobProvider),
  {
    ssr: false,
    loading: () => <CircularProgress />,
  }
);

async function handleSendEmail(
  blob: Blob,
  departmentName: string,
  data: Invoice,
  pathname: string,
  isAvoir: string
) {
  console.log("data---: ", data);
  if (blob) {
    const path = await addInvoiceToBucket(
      departmentName,
      data.id,
      blob,
      isAvoir
    );
    if (path) {
      const res = await sendInvoiceMail({
        name: data.clientName,
        email: data.clientEmail,
        invoiceLink: path,
        confirmationLink: pathname,
      });
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.data);
      }
    }
  }
}

interface Props {
  data: Invoice;
  page: Number;
}

const Download: FC<Props> = ({ page, data }) => {
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get("avoir");

  const locale = useSelector((state: RootState) => state.langSlice.value);
  const debounced = useDebounce(data, 500);
  const department = useSelector(
    (state: RootState) => state.departmentSlice.value
  );
  const handleSaveTemplate = async (blob: Blob) => {
    if (blob)
      addInvoiceToBucket(department.name, data.id, blob, query || "false");
  };

  const title = data.invoiceTitle ? data.invoiceTitle.toLowerCase() : "invoice";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      <PDFDownloadLink
        document={
          page === 0 ? (
            <DevisPage pdfMode={true} data={debounced} />
          ) : page === 1 ? (
            <Attestation pdfMode={true} data={debounced} />
          ) : (
            <ConventionPage pdfMode={true} data={debounced} />
          )
        }
        fileName={
          page === 0
            ? `${title}.pdf`
            : page === 1
              ? `Attestation.pdf`
              : `ConventionPage.pdf`
        }
        style={{ textDecoration: "none", display: "inherit" }}
      >
        {({ loading, blob, url, error }) =>
          loading ? (
            <CircularProgress />
          ) : (
            // <a href={url!} download={title} style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSaveTemplate(blob as Blob)}
            >
              Téléchargez et enregistrez le PDF
            </Button>
            // </a>
          )
        }
      </PDFDownloadLink>
      <Box sx={{ mt: 2 }}>
        <BlobProvider document={<DevisPage pdfMode={true} data={data} />}>
          {({ blob, url, loading, error }) => {
            if (loading) {
              return <CircularProgress />;
            }
            return (
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  handleSendEmail(
                    blob as Blob,
                    department.name,
                    data,
                    `${process.env.NEXT_PUBLIC_HOSTNAME}/${locale}/department/${department.uid}/devis/${data.id}/confirm`,
                    query || "false"
                  )
                }
              >
                envoyer par email
              </Button>
            );
          }}
        </BlobProvider>
      </Box>
    </Box>
  );
};

export default Download;
