'use client';
import { Box } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { useState } from "react";
import { useTranslations } from "next-intl";
import CreateStudent from "./CreateStudent";


export default  function StudentWrapper()  {
  const [dialogOpenStudent, setDialogOpenStudent] = useState(false);
  const t = useTranslations('student');
  
  function handleOpenStudent() {
    setDialogOpenStudent(false);
  }
  
  return (
    <>
    {dialogOpenStudent && <CreateStudent   openSteper={handleOpenStudent}/>}
      <Box
        width={"100%"}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <CustumButton label={
            <>
              <Add />
              {t('create-new-student')} </>
          } onClick={() => { setDialogOpenStudent(true) }} />
        
      </Box>

     
    </>
  );
}
