"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import { Box, MenuItem, Theme, Tooltip, styled } from "@mui/material";
import { UserWorker } from "../utils/types";
import DeleteWorker from "../DeleteWorker";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import EditWorker from "../EditWorker";
import EditRole from "../EditRole";
import Link from "next/link";
import { useTranslations } from "next-intl";

const ImageMenuItem = styled(MenuItem)`
  img {
    margin-right: 10px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
`;

export default function WorkersTable({
  workerData,
  currency,
}: {
  workerData: UserWorker[];
  currency: string;
}) {
  const t = useTranslations("worker");
  const supabase = createClient();

  const [rowsData, setRowsData] = useState(
    workerData.map((worker) => ({
      id: worker.uid,
      col2: [worker.uid, worker.avatar ?? "/images/profile.png"],
      col3: worker.first_name,
      col4: worker.last_name,
      col5: worker.email,
      col6: worker.phone,
      col7: worker.job_position,
      col8: worker.salary_hour + currency,
      col9: worker.salary_day + currency,
      col10: worker.salary_week + currency,
      col11: worker.salary_month + currency,
      col12: worker.supervisor,
      col13: worker.uid,
    }))
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "col2",
        headerName: t("picture"),
        width: 100,
        renderCell: (params: any) => (
          <ImageMenuItem>
            <Tooltip title="Click on the photo to show profile page">
              <Link href={`user/${params.value[0]}`}>
                <Image
                  src={`${params.value[1]}`}
                  width={40}
                  height={40}
                  alt={params.value}
                  loading="lazy"
                />
              </Link>
            </Tooltip>
          </ImageMenuItem>
        ),
      },
      { field: "col3", headerName: t("first-name"), width: 100 },
      { field: "col4", headerName: t("last-name"), width: 100 },
      { field: "col5", headerName: t("email"), width: 100 },
      { field: "col6", headerName: t("phone"), width: 100 },
      { field: "col7", headerName: t("job_title"), width: 100 },
      { field: "col8", headerName: t("salary-per-hour"), width: 130 },
      { field: "col9", headerName: t("salary-per-day"), width: 130 },
      { field: "col10", headerName: t("salary-per-week"), width: 130 },
      { field: "col11", headerName: t("salary-per-month"), width: 130 },
      { field: "col12", headerName: t("supervisor"), width: 130 },
      {
        field: "col13",
        headerName: "action",
        width: 200,
        renderCell: (params: any) => (
          <>
            <EditWorker worekerId={params.value as string} />
            <EditRole worekerId={params.value as string} />
            <DeleteWorker worekerId={params.value as string} />
          </>
        ),
      },
    ],
    [t]
  );

  useEffect(() => {
    const userworkerChanel = supabase
      .channel("userworkerChanel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "UserWorker" },
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
                col2: [
                  payload.new.uid,
                  payload.new.avatar ?? "/images/profile.png",
                ],
                col3: payload.new.first_name,
                col4: payload.new.last_name,
                col5: payload.new.email,
                col6: payload.new.phone,
                col7: payload.new.job_position ?? "No job position",
                col8: payload.new.salary_hour + currency,
                col9: payload.new.salary_day + currency,
                col10: payload.new.salary_day * 5 + currency,
                col11: payload.new.salary_month + currency,
                col12: payload.new.supervisor ?? "No supervisor",
                col13: payload.new.uid,
              },
            ]);
          } else if (payload.eventType === "UPDATE") {
            setRowsData((prevData) => {
              return prevData.map((row) => {
                if (row.id === payload.new.uid) {
                  return {
                    id: payload.new.uid,
                    col2: [
                      payload.new.uid,
                      payload.new.avatar ?? "/images/profile.png",
                    ],
                    col3: payload.new.first_name,
                    col4: payload.new.last_name,
                    col5: payload.new.email,
                    col6: payload.new.phone,
                    col7: payload.new.job_position ?? "No job position",
                    col8: payload.new.salary_hour + currency,
                    col9: payload.new.salary_day + currency,
                    col10: payload.new.salary_day * 5 + currency,
                    col11: payload.new.salary_month + currency,
                    col12: payload.new.supervisor ?? "No supervisor",
                    col13: payload.new.uid,
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
      userworkerChanel.unsubscribe();
    };
  });

  return (
    <Box mt={1.3} sx={{ width: "100%", height: "calc(100vh - 200px)" }}>
      <DataGrid
        rows={rowsData}
        columns={columns}
        rowHeight={40}
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
