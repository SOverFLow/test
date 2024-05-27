"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Theme } from "@mui/material";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Supplier } from "../utils/types";
import DeleteSupplier from "../DeleteSupplier";
import EditSupplier from "../EditSupplier";


const columns: GridColDef[] = [
  { field: "col1", headerName: "name", width: 200 },
  { field: "col2", headerName: "phone", width: 200 },
  { field: "col3", headerName: "email", width: 200 },
  { field: "col4", headerName: "created_at", width: 200 },
  {
    field: "col5",
    headerName: "action",
    width: 150,
    renderCell: (params: any) => (
      <>
       
       <EditSupplier supplierId={params.value as string} /> 
       <DeleteSupplier
        SupplierId={params.value as string}
      />
      </>
    ),
  },
];

export default function SuppliersTable({
  SupplierData,
}: {
  SupplierData: Supplier[];
}) {
  const [rowsData, setRowsData] = useState(
    SupplierData.map((supplier) => ({
      id: supplier.uid,
      col1: supplier.name,
      col2: supplier.phone_number,
      col3: supplier.email,
      col4: supplier.created_at,
      col5: supplier.uid,
    }))
  );

  const supabase = createClient();
  useEffect(() => {
    const supplierChanel = supabase
      .channel("supplierChanel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Supplier" },
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
                col2: payload.new.phone_number,
                col3: payload.new.email,
                col4: payload.new.created_at,
                col5: payload.new.uid,
              },
            ]);
          }
          else if (payload.eventType === "UPDATE") {
            setRowsData((prevData) => {
              return prevData.map((row) => {
                if (row.id === payload.new.uid) {
                  return {
                    id: payload.new.uid,
                    col1: payload.new.name,
                    col2: payload.new.phone_number,
                    col3: payload.new.email,
                    col4: payload.new.created_at,
                    col5: payload.new.uid,
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
        supplierChanel.unsubscribe();
      };
  });

  return (
    <Box mt={1.5} sx={{ width: "100%", height: "calc(100vh - 200px)" }}>
      <DataGrid
        rows={rowsData}
        columns={columns}
        rowHeight={40}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        pageSizeOptions={[25, 50, 100]}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: (theme: Theme) => theme.palette.primary.dark,
            color: (theme: Theme) => theme.palette.grey[100],
          },
          "& .MuiDataGrid-row": {
            bgcolor: (theme: Theme) => theme.palette.grey[100],
            "&:nth-of-type(even)": {
              bgcolor: (theme: Theme) => theme.palette.grey[300],
            },
            "&:hover": {
              bgcolor: (theme: Theme) => theme.palette.primary.light,
            },
          },
        }}
      />
    </Box>
  );
}
