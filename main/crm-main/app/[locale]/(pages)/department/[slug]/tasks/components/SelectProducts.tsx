// import { Box, Grid, Typography } from "@mui/material";
// import ProductsSelecter from "../createTask/products";
// import CreateProduct from "../../products/CreateProduct";
// import { CustumButton } from "@/components/ui/Button/CustumButton";
// import { AddCircleOutline } from "@mui/icons-material";
// import { FormError } from "@/components/ui/FormError/FormError";
// import theme from "@/styles/theme";
// import ProductList from "./ProductPreview";

// interface props {
//     tranlateObj: any;
//     errors: any;
//     products: any;
//     setSelected_products_in_stock: (value: any) => void;
//     setSelected_products_out_stock: (value: any) => void;
//     selected_products_in_stock: any;
//     selected_products_out_stock: any;
// }

// export default function SelectProduct(props: props) {
//   return (
//     <>
//       <Grid item xs={12} marginTop={"0rem"}>
//         <Grid container display={"flex"} width={"100%"} spacing={1}>
//           <Grid item xs={12} md={3}>
//             <Box
//               sx={{
//                 display: "flex",
//                 marginTop: "1.5rem",
//                 width: "100%",
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontWeight: 500,
//                   fontSize: "0.9rem",
//                   color: "#222222",
//                   display: "flex",
//                   alignItems: "end",
//                   width: "100%",
//                 }}
//               >
//                 {props.tranlateObj.consumables_From_Stock}
//               </Typography>
//             </Box>
//           </Grid>
//           <Grid
//             item
//             xs={12}
//             md={6}
//             display={"flex"}
//             alignItems={"center"}
//             justifyContent={"end"}
//             width={"100%"}
//             flexDirection={"column"}
//           >
//             <ProductsSelecter
//               products={props.products}
//               addedProducts={props.selected_products_in_stock}
//               onChange={(value: any) => {
//                 props.setSelected_products_in_stock(value);
//               }}
//               tranlateObj={props.tranlateObj}
//             />
//           </Grid>
//           {/* call the product add component */}
//           <Grid
//             item
//             xs={12}
//             md={3}
//             display={"flex"}
//             justifyContent={{ xs: "start", md: "end" }}
//             alignItems={{ xs: "start", md: "end" }}
//             width={"100%"}
//           >
//             <CreateProduct
//               isOverride={true}
//               style={{
//                 width: "100%",
//                 display: "flex",
//                 justifyContent: "end",
//               }}
//               openSteper={() => {}}
//             >
//               <CustumButton
//                 style={{
//                   fontSize: "0.7rem",
//                   fontWeight: 550,
//                   width: "100%",
//                   textTransform: "none",
//                   color: "#fff",
//                   backgroundColor: theme.palette.primary.main,
//                 }}
//                 label={
//                   <>
//                     {" "}
//                     <AddCircleOutline /> {props.tranlateObj.Add_Product}
//                   </>
//                 }
//                 onClick={() => {}}
//               />
//             </CreateProduct>
//           </Grid>
//           {props.selected_products_in_stock && (
//             <Grid item xs={12}>
//               <Box sx={{ display: "flex", justifyContent: "start" }}>
//                 <ProductList
//                   currency={currencySymbol}
//                   products={props.selected_products_in_stock}
//                   onDelete={(uid: string) => {
//                     console.log("deleted");
//                     const newProducts = props.selected_products_in_stock.filter(
//                       (product) => product.uid !== uid
//                     );
//                     setSelected_products_in_stock(newProducts);
//                     console.log(
//                       "DELEted",
//                       newProducts,
//                       selected_products_in_stock
//                     );
//                   }}
//                 />
//               </Box>
//             </Grid>
//           )}
//         </Grid>
//         {errors.products && <FormError error={errors.products} />}
//       </Grid>

//       <Grid item xs={12} marginTop={"1rem"} marginBottom={"0.5rem"}>
//         <Grid container display={"flex"} width={"100%"} spacing={1}>
//           <Grid item xs={12} md={3}>
//             <Box
//               sx={{
//                 display: "flex",
//                 marginTop: "1.5rem",
//                 width: "100%",
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontWeight: 500,
//                   fontSize: "0.9rem",
//                   color: "#222222",
//                   display: "flex",
//                   alignItems: "end",
//                 }}
//               >
//                 {props.tranlateObj.consumables_out_the_stock}
//               </Typography>
//             </Box>
//           </Grid>
//           <Grid
//             item
//             xs={12}
//             md={6}
//             display={"flex"}
//             alignItems={"center"}
//             justifyContent={"end"}
//             width={"100%"}
//             flexDirection={"column"}
//           >
//             <ProductsSelecter
//               products={productsOutStock}
//               onChange={(value: any) => {
//                 setSelected_products_out_stock(value);
//               }}
//               tranlateObj={props.tranlateObj}
//               addedProducts={selected_products_out_stock}
//             />
//           </Grid>
//           <Grid
//             item
//             xs={12}
//             md={3}
//             display={"flex"}
//             justifyContent={{ xs: "start", md: "end" }}
//             alignItems={{ xs: "start", md: "end" }}
//             width={"100%"}
//           >
//             <CreateProduct
//               isOverride={true}
//               style={{
//                 width: "100%",
//                 display: "flex",
//                 justifyContent: "end",
//                 alignItems: "end",
//               }}
//               openSteper={handleOpenProduct}
//             >
//               <CustumButton
//                 style={{
//                   fontSize: "0.7rem",
//                   fontWeight: 550,
//                   width: "100%",
//                   textTransform: "none",
//                   color: "#fff",
//                   backgroundColor: theme.palette.primary.main,
//                 }}
//                 label={
//                   <>
//                     {" "}
//                     <AddCircleOutlineIcon /> {props.tranlateObj.Add_Product}
//                   </>
//                 }
//                 onClick={handleOpenProduct}
//               />
//             </CreateProduct>
//           </Grid>
//           {selected_products_out_stock && (
//             <Grid item xs={12}>
//               <Box sx={{ display: "flex", justifyContent: "start" }}>
//                 <ProductList
//                   currency={currencySymbol}
//                   products={selected_products_out_stock}
//                   onDelete={(uid) => {
//                     setSelected_products_out_stock((prevProducts) => {
//                       const newProducts = prevProducts.filter(
//                         (product) => product.uid !== uid
//                       );
//                       return newProducts;
//                     });
//                   }}
//                 />
//               </Box>
//             </Grid>
//           )}
//         </Grid>
//         {errors.products && <FormError error={errors.products} />}
//       </Grid>
//     </>
//   );
// }
