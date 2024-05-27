"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useTranslations } from "next-intl";
import { startTransition, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Avatar, Box, Button, MenuItem, Theme, styled } from "@mui/material";
import DeleteService from "../DeletService";
import EditService from "../EditService";
import { fetchServerOneService, fetchServerService } from "../utils/fetchService";
import { useParams } from "next/navigation";
import { formatDate } from "../utils/dateFormat";
import { getFamily, getTva } from "../utils/getTables";

const ImageMenuItem = styled(MenuItem)`
  img {
    margin-right: 10px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
`;

export default function ServiceTable({ ServiceData }: { ServiceData?: any }) {
  const t = useTranslations("Service");
  const slug = useParams().slug;

  useEffect(() => {
    startTransition(async () => {
      let ServiceDatad = ServiceData;
      if (!ServiceData)
        ServiceDatad = await fetchServerService(slug as string);
      setRowsData(
        ServiceDatad?.map((service: any, index: number) => ({
          id: service.uid,
          col1: service.image,
          col2: service.title,
          col3: service.family,
          col4: service.buying_price_ht,
          col5: service.selling_price_ht,
          col6: service.tva,
          col7: service.buying_price_ttc,
          col8: service.selling_price_ttc,
          col9: service.units,
          col10: formatDate(service.created_at),
          col11: formatDate(service.updated_at),
          col12: service.uid,
        }))
      );
    });
  }, [slug,ServiceData]);

	const [rowsData, setRowsData] = useState<any>([
		{
			id: "",
			col1: "",
			col2: "",
			col3: "",
			col4: "",
			col5: "",
			col6: "",
			col7: "",
			col8: "",
			col9: "",
			col10: "",
			col11: "",
      col12: "",
		},
	]);

  useEffect(() => {
    const clientChannel = supabase
      .channel("realtime:client_status")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Service" },
        (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            startTransition(async () => {
              let ServiceDatada = await fetchServerService(slug as string);
              setRowsData(
                ServiceDatada.map((service: any, index: number) => ({
                  id: service.uid,
                  col1: service.image,
                  col2: service.title,
                  col3: service.family,
                  col4: service.buying_price_ht,
                  col5: service.selling_price_ht,
                  col6: service.tva,
                  col7: service.buying_price_ttc,
                  col8: service.selling_price_ttc,
                  col9: service.units,
                  col10: formatDate(service.created_at),
                  col11: formatDate(service.updated_at),
                  col12: service.uid,
                }))
              );
            });
          }
        }
      )
      .subscribe();

    const clientChannel1 = supabase
      .channel("realtime:tvaservice_status")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "TVA" },
        (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            getTva(slug as string)
            .then((data) => {
              if (data) {
                const uniqueTva = Array.from(
                  new Set(data.map((tva) => ({ name: tva.name, value: tva.value })))
                );
                setTvaList([...uniqueTva]);
              }
            })
            .catch((error) => console.error(error));
          }
        }
      )
      .subscribe();

      const clientChannel11 = supabase
      .channel("realtime:familyservice_status")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ServiceFamily" },
        (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            getFamily(slug as string)
            .then((data) => {
              if (data) {
                const uniqueFamily = Array.from(
                  new Set(data.map((family) => ({ name: family.name })))
                );
                setFamilyList([...uniqueFamily]);
              }
            })
            .catch((error) => console.error(error));
          }
        }
      )
      .subscribe();


    const clientChannel2 = supabase
      .channel("realtime:client_status")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Bien" },
        (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            startTransition(async () => {
              let ServiceDatada = await fetchServerService(slug as string);
              setRowsData(
                ServiceDatada.map((service: any, index: number) => ({
                  id: service.uid,
                  col1: service.image,
                  col2: service.title,
                  col3: service.family,
                  col4: service.buying_price_ht,
                  col5: service.selling_price_ht,
                  col6: service.tva,
                  col7: service.buying_price_ttc,
                  col8: service.selling_price_ttc,
                  col9: service.units,
                  col10: formatDate(service.created_at),
                  col11: formatDate(service.updated_at),
                  col12: service.uid,
                }))
              );
            });
          }
        }
      )
      .subscribe();

    const clientChannel3 = supabase
      .channel("realtime:client_status")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Client" },
        (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            startTransition(async () => {
              let ServiceDatada = await fetchServerService(slug as string);
              setRowsData(
                ServiceDatada.map((service: any, index: number) => ({
                  id: service.uid,
                  col1: service.image,
                  col2: service.title,
                  col3: service.family,
                  col4: service.buying_price_ht,
                  col5: service.selling_price_ht,
                  col6: service.tva,
                  col7: service.buying_price_ttc,
                  col8: service.selling_price_ttc,
                  col9: service.units,
                  col10: formatDate(service.created_at),
                  col11: formatDate(service.updated_at),
                  col12: service.uid,
                }))
              );
            });
          }
        }
      )
      .subscribe();

		return () => {
			clientChannel.unsubscribe();
			clientChannel1.unsubscribe();
      clientChannel11.unsubscribe();
			clientChannel2.unsubscribe();
			clientChannel3.unsubscribe();
		};
	});

  const [familyList, setFamilyList] = useState<{ name: string }[]>([]);
  const [tvaList, setTvaList] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    getTva(slug as string)
      .then((data) => {
        if (data) {
          const uniqueTva = Array.from(
            new Set(data.map((tva) => ({ name: tva.name, value: tva.value })))
          );
          setTvaList([...uniqueTva]);
        }
      })
      .catch((error) => console.error(error));
      getFamily(slug as string)
      .then((data) => {
        if (data) {
          const uniqueFamily = Array.from(
            new Set(data.map((family) => ({ name: family.name })))
          );
          setFamilyList([...uniqueFamily]);
        }
      })
      .catch((error) => console.error(error));
  }, [slug]);

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: 'Image',
      width: 80,
      renderCell: (params: any) => {
        return (
        <ImageMenuItem>
          <Avatar  
            src={params.value}
            alt={params.value}
          />
        </ImageMenuItem>
      )
      } 
    },
    { field: "col2", headerName: t("Title"), width: 120, type: "string" },
    { field: "col3", headerName: t('family'), width: 120, type: "string" },
    { field: "col4", headerName: t('buying-price-ht-1'), width: 100, type: "string" },
    { field: "col5", headerName: t('selling-price-ht-1'), width: 100, type: "string" },
    { field: "col6", headerName: 'TVA', width: 80, type: "string" },
    { field: "col7", headerName: t('buying-price-ttc-1'), width: 120, type: "string" },
    { field: "col8", headerName: t('selling-price-ttc-1'), width: 120, type: "string" },
    { field: "col9", headerName: t("Units"), width: 100, type: "string" },
    { field: "col10", headerName: t('creation-date'), width: 120, type: "string" },
    { field: "col11", headerName: t('updated-date'), width: 120, type: "string" },
    {
      field: "col12",
      headerName: `${t("Actions")}`,
      width: 250,
      renderCell: (params: any) => (
        <>
          <EditService serviceId={params.value as string} tvaList={tvaList} familyList={familyList} setTvaList={setTvaList} setFamilyList={setFamilyList} />
          <DeleteService serviceId={params.value} />
        </>
      ),
    },
  ];
  
  const supabase = createClient();
  useEffect(() => {
    const serviceChanel = supabase
      .channel("ServiceChanel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Service" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setRowsData((prevData: any) => {
              return prevData.filter((row: any) => row.id !== payload.old.uid);
            });
          } else if (payload.eventType === "INSERT") {
            startTransition(async () => {
              const newService = await fetchServerOneService(payload.new.uid);
              setRowsData((prevData: any) => [
                ...prevData,
                {
                  id: newService?.uid,
                  col1: newService?.image,
                  col2: newService?.title,
                  col3: newService?.family,
                  col4: newService?.buying_price_ht,
                  col5: newService?.selling_price_ht,
                  col6: newService?.tva,
                  col7: newService?.buying_price_ttc,
                  col8: newService?.selling_price_ttc,
                  col9: newService?.units,
                  col10: formatDate(newService?.created_at),
                  col11: formatDate(newService?.updated_at),
                  col12: newService?.uid,
                },
              ]);
            });
          } else if (payload.eventType === "UPDATE") {
            startTransition(async () => {
              const newService = await fetchServerOneService(payload.new.uid);
              setRowsData((prevData: any) => {
                return prevData.map((row: any) => {
                  if (row.id === payload.new.uid) {
                    return {
                      id: newService?.uid,
                      col1: newService?.image,
                      col2: newService?.title,
                      col3: newService?.family,
                      col4: newService?.buying_price_ht,
                      col5: newService?.selling_price_ht,
                      col6: newService?.tva,
                      col7: newService?.buying_price_ttc,
                      col8: newService?.selling_price_ttc,
                      col9: newService?.units,
                      col10: formatDate(newService?.created_at),
                      col11: formatDate(newService?.updated_at),
                      col12: newService?.uid,
                    };
                  }
                  return row;
                });
              });
            });
          }
        }
      )
      .subscribe();
    return () => {
      serviceChanel.unsubscribe();
    };
  });

  return (
    <Box mt={3} sx={{ width: "100%", height: "calc(100vh - 200px)" }}>
      <DataGrid
        columns={columns}
        rows={rowsData}
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
