"use client";
import React, { useState, useEffect, useTransition } from "react";
import { initialInvoice } from "./data/initialData";
import Download from "./components/DownloadPDF";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import { Tabs, Tab, CircularProgress } from "@mui/material";
import { Invoice } from "./data/types";
import DevisPage from "./components/DevisPage";
import "./scss/main.scss";
import ConventionPage from "./components/ConventionPage";
import PDFViewer from "./components/PDFViewer";
import { useParams } from "next/navigation";
import Attestation from "./components/Attestation";
import { useTranslations } from "next-intl";
import StudentPage from "./components/StudentPages";
import { getDevisData, getIfDepartmentIsFormation } from "./fetchUtils/fetchServerSide";

interface Student {
  uid: string;
  name: string;
  email: string;
  status: "generated" | "Pending" | string;
}

const students: Student[] = [
  { uid: "1", name: "John Doe", email: "johndoe@example.com", status: "Pending" },
];

function DevisID() {
  const [data, setData] = useState<Invoice>(initialInvoice);
  const [open, setOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(Date.now());
  const [isFormation, setIsFormation] = useState(true);
  const [activeGenerator, setActiveGenerator] = useState(0); 
  const [isPending, startTransition] = useTransition();
  const { locale, slug, DevisID } = useParams();
  const t = useTranslations("invoice");


  useEffect(() => {
    // getDevisDataFromLocalStorage();
    startTransition(async () => {
      const fetchedData = await getDevisData(DevisID as string);
      setData((prev) => ({ ...prev, ...fetchedData, id: DevisID as string }));
      const isFormation:any = await getIfDepartmentIsFormation(slug as string);
      setIsFormation(isFormation);
    });
  }, [DevisID, slug]);

  const handleOpen = () => {
    setOpen(true);
    setDialogKey(Date.now());
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeGenerator = (event: any, newValue: any) => {
    setActiveGenerator(newValue);
  };
  const onInvoiceUpdated = (invoice: Invoice) => {
    window.localStorage.setItem("invoiceData", JSON.stringify(invoice));
    setData(invoice);
  };
  return (
    <>
    {isPending || data == initialInvoice ? (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "88vh",
        }}
      >
        <CircularProgress />
      </div>
    ) : (
      <div className="app">
         <Dialog open={open} onClose={handleClose}>
              <DialogContent>
                <Download page={activeGenerator} key={dialogKey} data={data} />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>{t('Close')}</Button>
              </DialogActions>
            </Dialog>
       
        {isFormation && (
            <Box sx={{ mb: 4 }}>
              <Button onClick={handleOpen}>{t('Generate All PDFs')}</Button>
            </Box>
        )}
        {isFormation && (
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeGenerator}
              onChange={handleChangeGenerator}
              aria-label={t('PDF generator switch')}
            >
              <Tab label="Devis"/>
              <Tab label='Students' />
              <Tab label={t('Attestation')} />
              <Tab label={t('Convention')} />
              <Tab label={t('PDFs')} />
            </Tabs>
          </Box>
        )}
        {activeGenerator === 0 && (
          <>
            <Box sx={{ mb: 2, mt: 2 }}>
              <Button onClick={handleOpen}>{t('Generate PDF')}</Button>
            </Box>
            <DevisPage data={data} onChange={onInvoiceUpdated} />
          </>
        )}
         {activeGenerator === 1 && (
          <>
            <StudentPage data={data} students={students} />
          </>
        )}
        {activeGenerator === 2 && (
          <>
            <Box sx={{ mb: 2, mt: 2 }}>
              <Button onClick={handleOpen}>{t('Generate PDF')}</Button>
            </Box>
            <Attestation data={data} onChange={onInvoiceUpdated} />
          </>
        )}
        {activeGenerator === 3 && (
          <>
            <Box sx={{ mb: 2, mt: 2 }}>
              <Button onClick={handleOpen}>{t('Generate PDF')}</Button>
            </Box>
            <ConventionPage data={data} onChange={onInvoiceUpdated} />
          </>
        )}
        {activeGenerator === 4 && (
          <>
            <PDFViewer />
          </>
        )}
      </div>
    )} 
  </>
  );
}

export default DevisID;
