"use client";
import { Box } from "@mui/material";
import fetchServerStock from "./utils/fetchServerStock";
import CreateStock from "./CreateStock";
import StockTable from "./StockTable";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState, useTransition } from "react";
import { Stock } from "./utils/types";

export default function Stocks({ params }: { params: { slug: string } }) {
  const [stockData, setStockData] = useState<Stock[]>([]);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    startTransition(() => {
      fetchServerStock(params.slug).then((data: Stock[] | undefined) => {
        if (data) {
          console.log("data: ", data);
          setStockData(data);
        }
      });
    });
  }, [params.slug]);
  const [openDialog, setOpenDialog] = useState(false);
  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Box
        width={"100%"}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Box>
          <CustumButton
            label={
              <>
                <AddIcon />
                Create new Stock
              </>
            }
            onClick={() => setOpenDialog(true)}
          />
        </Box>
        {openDialog && <CreateStock open={openDialog} onClose={handleClose} />}
      </Box>

      <Box>
        <StockTable StockData={stockData} />
      </Box>
    </>
  );
}
