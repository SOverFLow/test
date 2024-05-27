"use client";
import { Box } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { useState } from "react";
import CreateClient from "./CreateClient";
import { useTranslations } from "next-intl";
// import SendIcon from "@mui/icons-material/Send";

export default function ClientWrapper() {
  const [dialogOpenClient, setDialogOpenClient] = useState(false);
  const t = useTranslations("client");

  function handleOpenClient() {
    setDialogOpenClient(false);
  }

  return (
    <>
      {dialogOpenClient && <CreateClient openSteper={handleOpenClient} />}
      <Box
        width={"100%"}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <CustumButton
          label={
            <>
              <Add />
              {t("create-new-client")}
            </>
          }
          onClick={() => {
            setDialogOpenClient(true);
          }}
        />

        {/* <CustumButton
          label={
            <>
              <SendIcon />
              {"Send email for all students"}{" "}
            </>
          }
          onClick={() => console.log("send email")}
        /> */}
      </Box>
    </>
  );
}
