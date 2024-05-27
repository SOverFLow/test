"use client";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Box, Button, MenuItem, styled, Theme } from "@mui/material";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Product } from "../utils/types";
import DeleteProduct from "../DeleteProduct";
import EditProduct from "../EditProduct";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import CreateProduct from "../CreateProduct";
import { notification } from "antd";
import { fetchClientCurrency } from "../utils/fetchClient";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import { Add } from "@mui/icons-material";

const ImageMenuItem = styled(MenuItem)`
  img {
    margin-right: 10px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
`;

export default function ProductsTable({
  ProductsData,
}: {
  ProductsData: Product[];
}) {
  const t = useTranslations("product");
  const supabase = createClient();
  const departmentId = useSelector(
    (state: RootState) => state.departmentSlice.value?.uid
  );
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [api, contextHolder] = notification.useNotification();
  const [currency, setCurrency] = useState<string>("$");
  const [openCreateProduct, setOpenCreateProduct] = useState(false);

  useEffect(() => {
    console.log("departmentId: ", departmentId);
    departmentId &&
      supabase
        .from("Product")
        .select("name, quantity, stock_limit_for_alert")
        .eq("department_id", departmentId)
        .then(({ data, error }: any) => {
          if (error) {
            console.log("Error fetching product: ", error);
          }
          if (data) {
            data.map((product: any, index: number) => {
              if (product.quantity <= product.stock_limit_for_alert) {
                setTimeout(() => {
                  api.warning({
                    message: "Stock Alert",
                    description: `${t("product")} ${product.name} ${t("is-running-out-of-stock")}`,
                    duration: 10,
                  });
                }, index * 1000);
              }
            });
          }
        });
  }, [departmentId, t, supabase, api]);

  useEffect(() => {
    departmentId &&
      fetchClientCurrency(departmentId).then((data) => {
        setCurrency(data as string);
      });
  }, [departmentId]);

  const columns: GridColDef[] = [
    { field: "col1", headerName: t("lable"), width: 240 },
    {
      field: "col2",
      headerName: t("picture"),
      width: 100,
      renderCell: (params: any) => (
        <ImageMenuItem>
          <Image
            src={params.value ?? "/images/product.png"}
            width={35}
            height={35}
            alt={params.value}
            loading="lazy"
          />
        </ImageMenuItem>
      ),
    },
    { field: "col4", headerName: t("quantity"), width: 100 },
    { field: "col6", headerName: `${t("buy-price")} ${currency}`, width: 100 },
    { field: "col61", headerName: "Buy Tva", width: 100 },
    { field: "col62", headerName: `Buy price TTC ${currency}`, width: 100 },
    { field: "col5", headerName: `${t("sell-price")} ${currency}`, width: 100 },
    { field: "col51", headerName: "Sell Tva", width: 100 },
    { field: "col52", headerName: `Sell price TTC ${currency}`, width: 100 },
    { field: "col7", headerName: t("entry-date"), width: 150 },
    { field: "col8", headerName: t("exit-date"), width: 150 },
    { field: "col9", headerName: t("experation-date"), width: 150 },
    { field: "col10", headerName: t("payment-method"), width: 150 },
    { field: "col11", headerName: t("product-family"), width: 150 },
    {
      field: "action",
      headerName: "action",
      width: 150,
      renderCell: (params: any) => (
        <>
          <EditProduct productId={params.value as string} />
          <DeleteProduct productId={params.value as string} />
        </>
      ),
    },
  ];
  const [rowsData, setRowsData] = useState(
    ProductsData.map((Product) => ({
      id: Product.uid,
      col1: Product.name,
      col2: Product.image ?? "/images/product.png",
      col4: Product.quantity,
      col5: Product.sell_price,
      col51: Product.sell_tva,
      col52: Product.sell_price_ttc,
      col6: Product.buy_price,
      col61: Product.buy_tva,
      col62: Product.buy_price_ttc,
      col7: Product.entry_date,
      col8: Product.exit_date,
      col9: Product.expiration_date,
      col10: Product.payment_method,
      col11: Product.product_family,
      action: Product.uid,
    }))
  );

  useEffect(() => {
    const productChanel = supabase
      .channel("productChanel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Product" },
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
                col2: payload.new.image ?? "/images/product.png",
                col4: payload.new.quantity,
                col5: payload.new.sell_price,
                col51: payload.new.sell_tva,
                col52: payload.new.sell_price_ttc,
                col6: payload.new.buy_price,
                col61: payload.new.buy_tva,
                col62: payload.new.buy_price_ttc,
                col7: payload.new.entry_date,
                col8: payload.new.exit_date,
                col9: payload.new.expiration_date,
                col10: payload.new.payment_method,
                col11: payload.new.product_family,
                action: payload.new.uid,
              },
            ]);
          } else if (payload.eventType === "UPDATE") {
            setRowsData((prevData) => {
              return prevData.map((row) => {
                if (row.id === payload.new.uid) {
                  return {
                    id: payload.new.uid,
                    col1: payload.new.name,
                    col2: payload.new.image ?? "/images/product.png",
                    col4: payload.new.quantity,
                    col5: payload.new.sell_price,
                    col51: payload.new.sell_tva,
                    col52: payload.new.sell_price_ttc,
                    col6: payload.new.buy_price,
                    col61: payload.new.buy_tva,
                    col62: payload.new.buy_price_ttc,
                    col7: payload.new.entry_date,
                    col8: payload.new.exit_date,
                    col9: payload.new.expiration_date,
                    col10: payload.new.payment_method,
                    col11: payload.new.product_family,
                    action: payload.new.uid,
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
      productChanel.unsubscribe();
    };
  });

  return (
    <>
      {contextHolder}
      <Box display={"flex"} gap={".5rem"}>
        <CustumButton
          label={
            <>
              <Add />
              {t("create-new-product")}
            </>
          }
          onClick={() => setOpenCreateProduct(true)}
        />
        {!!selectedRows.length && (
          <DeleteProduct
            isMultiple
            productId={selectedRows}
            lable={`Delete ${selectedRows.length} 
          ${selectedRows.length > 1 ? "Products" : "Product"}`}
          />
        )}
      </Box>
      <Box mt={1} sx={{ width: "100%", height: "calc(100vh - 180px)" }}>
        <DataGrid
          rows={rowsData}
          columns={columns}
          rowHeight={40}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(
            selectionModel: GridRowSelectionModel
          ) => {
            setSelectedRows(selectionModel as string[]);
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
      {openCreateProduct && (
        <CreateProduct
          open={openCreateProduct}
          handleClose={() => setOpenCreateProduct(false)}
        />
      )}
    </>
  );
}
