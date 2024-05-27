"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Theme } from "@mui/material";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Biens } from "./utils/types";
import formatDate from "@/utils/formatDate";
import EditBien from "./EditBien";
import DeleteBien from "./DeleteBien";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function BiensTable({ biensData }: { biensData: Biens[] }) {
  const t = useTranslations("Biens");
  const [istrue, setIstrue] = useState(false);
  const columns: GridColDef[] = [
    { field: "col1", headerName: t("name"), width: 200 },
    { field: "col2", headerName: t("type"), width: 200 },
    { field: "col3", headerName: t("price"), width: 200 },
    { field: "col4", headerName: t("location"), width: 200 },
    { field: "col5", headerName: t("created_at"), width: 200 },
    { field: "col6", headerName: t("status"), width: 200 },
    {
      field: "col7",
      headerName: t("action"),
      width: 150,
      renderCell: (params: any) => (
        <>
          {/* <Button
            variant="text"
            color="info"
            onClick={}
            sx={{
              width: "30px",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
            size="small"
            title={"Edit Bien"}
          >
            <EditIcon />
          </Button> */}
          <EditBien dialogOpen bien_id={params.value as string} />
          <DeleteBien bienId={params.value as string} />
        </>
      ),
    },
  ];

  const [rowsData, setRowsData] = useState(
    biensData.map((bien) => ({
      id: bien.uid,
      col1: bien.name,
      col2: bien.type,
      col3: bien.price,
      col4: bien.location || "No location",
      col5: formatDate(new Date(bien.created_at)),
      col6: bien.status,
      col7: bien.uid,
    }))
  );
  const departmentId = useSelector<RootState, string>(
    (state) => state.departmentSlice.value.uid
  );
  const supabase = createClient();
  useEffect(() => {
    if (!departmentId) return;
    console.log("departmentId", departmentId);
    const bienChanel = supabase
      .channel("realtime:bienChanel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Bien",
          filter: "department_id=eq." + departmentId,
        },
        (payload) => {
          console.log("payload", payload);
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
                col3: payload.new.price,
                col4: payload.new.location || "No location",
                col5: formatDate(new Date(payload.new.created_at)),
                col6: payload.new.status,
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
                    col3: payload.new.price,
                    col4: payload.new.location || "No location",
                    col5: formatDate(new Date(payload.new.created_at)),
                    col6: payload.new.status,
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
      bienChanel.unsubscribe();
    };
  }, [departmentId, supabase]);

  return (
    <Box mt={1.5} sx={{ width: "100%", height: "calc(100vh - 200px)" }}>
      <DataGrid
        rows={rowsData}
        columns={columns}
        rowHeight={40}
        componentsProps={{
          pagination: {
            labelRowsPerPage: t("rows-per-page"),
          },
        }}
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
