'use client';
import { Box } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { use, useState } from "react";
import CreateWorker from "./CreateWorker";
import { useTranslations } from "next-intl";


export default  function WorkerWrapper()  {
  const [dialogOpenWorker, setDialogOpenWorker] = useState(false);
  const t = useTranslations('worker');
  
  function handleOpenWorker() {
    setDialogOpenWorker(false);
  }
  
  return (
    <>
    {dialogOpenWorker && <CreateWorker   openSteper={handleOpenWorker}/>}
      <Box
        width={"100%"}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <CustumButton label={
            <>
              <Add />
              {t('create-new-worker')} </>
          } onClick={() => { setDialogOpenWorker(true) }} />
        
      </Box>

     
    </>
  );
}
