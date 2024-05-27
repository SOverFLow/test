"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Stock } from "../utils/types";
import DeleteStock from "../DeleteStock";
import EditStock from "../EditStock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";

export default function StockTable({ StockData }: { StockData: Stock[] }) {
  const t = useTranslations("Stock");
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );
  const [openDialog, setOpenDialog] = useState(false);
  const handleClose = () => {
    setOpenDialog(false);
  };
  const [openedDialogId, setOpenedDialogId] = useState("");
  useEffect(() => {
    setRowsData(
      StockData.map((stock) => ({
        id: stock.uid,
        col1: stock.name,
        col2: stock.type,
        col3: stock.purchase_date,
        col4: stock.expiry_date,
        col5: stock.location,
        col6: stock.payment_method,
        col7: stock.uid,
      }))
    );
  }, [StockData]);

  const columns: GridColDef[] = [
    { field: "col1", headerName: t("name"), width: 150 },
    { field: "col2", headerName: t("type"), width: 150 },
    { field: "col3", headerName: t("purchase_date"), width: 150 },
    { field: "col4", headerName: t("expiry_date"), width: 150 },
    { field: "col5", headerName: t("location"), width: 150 },
    { field: "col6", headerName: t("payment_method"), width: 150 },
    {
      field: "col7",
      headerName: t("action"),
      width: 200,
      renderCell: (params) => (
        <>
          <Link
            href={`stock/${params.value as string}`}
            aria-label={`View details for stock ${params.value}`}
          >
            <VisibilityIcon color="info" />
          </Link>
          <Box>
            <Button
              variant="text"
              color="info"
              sx={{
                width: "30px",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
              size="small"
              title={"Edit Stock"}
              onClick={() => {
                setOpenDialog(true);
                setOpenedDialogId(params.value as string);
              }}
            >
              <EditIcon />
            </Button>
          </Box>
          {openDialog && openedDialogId === params.value && (
            <EditStock
              open={openDialog}
              onClose={handleClose}
              stockId={params.value as string}
            />
          )}
          <DeleteStock stockId={params.value as string} />
        </>
      ),
    },
  ];

  const [rowsData, setRowsData] = useState(
    StockData.map((stock) => ({
      id: stock.uid,
      col1: stock.name,
      col2: stock.type,
      col3: stock.purchase_date,
      col4: stock.expiry_date,
      col5: stock.location,
      col6: stock.payment_method,
      col7: stock.uid,
    }))
  );

  const supabase = createClient();
  useEffect(() => {
    const stockChanel = supabase
      .channel("stockChanel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Stock",
          filter: "department_id=eq." + departmentId,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setRowsData((prevData) => {
              return prevData.filter((row) => row.id !== payload.old.uid);
            });
          } else if (payload.eventType === "INSERT") {
            setRowsData((prevData) => [
              ...prevData,
              {
                id: payload.new.uid,
                col1: payload.new.name,
                col2: payload.new.type,
                col3: payload.new.purchase_date,
                col4: payload.new.expiry_date,
                col5: payload.new.location,
                col6: payload.new.payment_method,
                col7: payload.new.uid,
              },
            ]);
          } else if (payload.eventType === "UPDATE") {
            setRowsData((prevData) => {
              return prevData.map((row) => {
                if (row.id === payload.new.uid) {
                  return {
                    id: payload.new.uid,
                    col1: payload.new.name,
                    col2: payload.new.type,
                    col3: payload.new.purchase_date,
                    col4: payload.new.expiry_date,
                    col5: payload.new.location,
                    col6: payload.new.payment_method,
                    col7: payload.new.uid,
                  };
                }
                return row;
              });
            });
          }
        }
      )
      .subscribe();
    return () => {
      stockChanel.unsubscribe();
    };
  });

  return (
    <Box mt={1} sx={{ width: "100%", height: "calc(100vh - 180px)" }}>
      <DataGrid
        componentsProps={{
          pagination: {
            labelRowsPerPage: t("rows-per-page"),
          },
        }}
        rows={rowsData}
        columns={columns}
        rowHeight={40}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: (theme) => theme.palette.primary.dark,
            color: (theme) => theme.palette.grey[100],
          },
          "& .MuiDataGrid-row": {
            bgcolor: (theme) => theme.palette.grey[100],
            "&:nth-of-type(even)": {
              bgcolor: (theme) => theme.palette.grey[300],
            },
            "&:hover": {
              bgcolor: (theme) => theme.palette.primary.light,
            },
          },
        }}
      />
    </Box>
  );
}
