"use client";

import { ReactNode, useState } from "react";
import { Box, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";

// Custom components
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import TableRowsIcon from "@mui/icons-material/TableRows";
import WrapperCreateTask from "./createTask/WrapperCreateTask";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useTranslations } from "next-intl";

interface WrapperComponentProps {
  children: [ReactNode, ReactNode];
}

export default function ClientTasksWrapper({
  children,
}: WrapperComponentProps) {
  const t = useTranslations("AddTaskForm");
  const searchParams = useSearchParams();
  const [dialogOpenSteper, setDialogOpenSteper] = useState(false);
  let alignmentParams = searchParams.get("alignment") as "cards" | "grid";

  if (
    !alignmentParams ||
    (alignmentParams !== "cards" && alignmentParams !== "grid")
  ) {
    alignmentParams = "grid";
  }
  const [alignment, setAlignment] = useState<"cards" | "grid">(alignmentParams);

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: "cards" | "grid"
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <Box mt={1}>
      <Box
        width={"100%"}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "end",
        }}
      >
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignment}
          color="primary"
          sx={{ height: "40px" }}
        >
          <Link href={"?alignment=grid"}>
            <ToggleButton value="grid">
              <TableRowsIcon />
              Grid
            </ToggleButton>
          </Link>
          <Link href={"?alignment=cards"}>
            <ToggleButton value="cards">
              <ViewCarouselIcon /> cards
            </ToggleButton>
          </Link>
        </ToggleButtonGroup>
        <Box display={"flex"} gap={".3rem"} flexWrap={"wrap"}>
          {dialogOpenSteper && (
            <WrapperCreateTask
              dialogOpenSteper={dialogOpenSteper}
              setDialogOpenSteper={setDialogOpenSteper}
              showAddButton={true}
            />
          )}
          <CustumButton
            label={
              <>
                <AddCircleOutlineIcon />
                {t("Create Task")}
              </>
            }
            onClick={() => setDialogOpenSteper(true)}
          />
        </Box>
      </Box>
      {alignment === "cards" ? children[0] : children[1]}
    </Box>
  );
}
