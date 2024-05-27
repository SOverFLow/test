"use client";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Image from "next/image";
import { Box, MenuItem, Theme, Tooltip, styled } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Student } from "../utils/types";
import EditStudent from "../EditStudent";
import DeleteStudent from "../DeleteStudent";

const ImageMenuItem = styled(MenuItem)`
  img {
    margin-right: 10px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
`;

export default function StudentsTable({
  studentData,
}: {
  studentData: Student[];
}) {
  const t = useTranslations("student");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const supabase = createClient();

  const [rowsData, setRowsData] = useState(
    studentData.map((student) => ({
      id: student.uid,
      col2: [student.uid, student.avatar ?? "/images/profile.png"],
      col3: student.first_name,
      col4: student.last_name,
      col5: student.email,
      col6: student.phone,
      col7: student.registration_date?.slice(0, 10),
      col8: student.address,
      col9: student.budget,
      col10: student.payment_method,
      col11: student.social_security_number,
      col12: student.uid,
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
      { field: "col5", headerName: "email", width: 100 },
      { field: "col6", headerName: t("phone"), width: 100 },
      { field: "col7", headerName: t("registration_date"), width: 130 },
      { field: "col8", headerName: t("address"), width: 130 },
      { field: "col9", headerName: t("budget"), width: 130 },
      { field: "col10", headerName: t("payment_method"), width: 130 },
      { field: "col11", headerName: t("Social-Security-Number"), width: 130 },
      {
        field: "col12",
        headerName: "action",
        width: 200,
        renderCell: (params: any) => (
          <>
            <EditStudent studentId={params.value as string} />
            <DeleteStudent StudentId={params.value as string} />
          </>
        ),
      },
    ],
    [t]
  );

  useEffect(() => {
    const userstudentChanel = supabase
      .channel("userstudentChanel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Student" },
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
                col7: payload.new.registration_date?.slice(0, 10),
                col8: payload.new.address,
                col9: payload.new.budget,
                col10: payload.new.payment_method,
                col11: payload.new.social_security_number,
                col12: payload.new.uid,
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
                    col7: payload.new.registration_date?.slice(0, 10),
                    col8: payload.new.address,
                    col9: payload.new.budget,
                    col10: payload.new.payment_method,
                    col11: payload.new.social_security_number,
                    col12: payload.new.uid,
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
      userstudentChanel.unsubscribe();
    };
  });

  return (
    <>
      <Box sx={{ display: "flex", margin: "6px 0px" }}>
        {!!selectedRows.length && (
          <DeleteStudent
            isMultiple
            StudentId={selectedRows}
            lable={`Delete ${selectedRows.length} 
      ${selectedRows.length > 1 ? "Students" : "Student"}`}
          />
        )}
      </Box>

      <Box mt={1.3} sx={{ width: "100%", height: "calc(100vh - 200px)" }}>
        <DataGrid
          rows={rowsData}
          columns={columns}
          rowHeight={40}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(
            selectionModel: GridRowSelectionModel
          ) => {
            setSelectedRows(selectionModel as string[]);
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
    </>
  );
}
