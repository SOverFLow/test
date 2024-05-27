import { getDbOnSever } from "@/utils/supabase/cookie";
import { Container, Grid, Typography, Box } from "@mui/material";
import Image from "next/image";

const fetchProductDetails = async (productId: string) => {
  const supabase = await getDbOnSever();
  const { data, error } = await supabase
    .from("Product")
    .select("")
    .eq("uid", productId)
    .single();
  if (error) {
    console.error("Error fetching product details: ", error);
    return null;
  }
  return data;
};

export default function Component() {
  return (
    <Container sx={{ py: 12 }}>
      <Grid container spacing={12}>
        <Grid item xs={12} md={6}>
          <img
            src={"/images/product.png"}
            alt={"Product Image"}
            width={"100%"}
            style={{
              borderRadius: 12,
              objectFit: "cover",
              aspectRatio: "600/600",
            }}
            loading="lazy"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box display="grid" gap={6}>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                Premium Leather Backpack
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Durable and stylish backpack for everyday use.
              </Typography>
            </Box>
            <Grid container spacing={4}>
              {[
                { label: "Area", value: "100 sq. ft." },
                { label: "Buy Price", value: "$50.00" },
                { label: "Buy Tax", value: "8%" },
                { label: "Country of Origin", value: "Italy" },
                { label: "Creation Date", value: "2023-04-15" },
                { label: "Department Cost ID", value: "DC001" },
                { label: "Department ID", value: "D001" },
                { label: "Desired Stock", value: "50" },
                { label: "Entry Date", value: "2023-04-01" },
                { label: "Exit Date", value: "2024-03-31" },
                { label: "Expiration Date", value: "2025-12-31" },
                { label: "Height", value: "18 inches" },
                { label: "Unique ID", value: "PB001" },
                { label: "Length", value: "12 inches" },
                { label: "Nature of Product", value: "Accessory" },
                {
                  label: "Notes",
                  value:
                    "High-quality leather backpack with multiple compartments.",
                },
                { label: "Payment Method", value: "Visa, Mastercard" },
                { label: "Quantity", value: "25" },
                { label: "Sell Price", value: "$99.00" },
                { label: "Sell Tax", value: "10%" },
                { label: "Serial Number", value: "PB001-2023" },
                { label: "State/Province of Origin", value: "Tuscany" },
                { label: "Stock ID", value: "S001" },
                { label: "Stock Limit for Alert", value: "10" },
                { label: "Supplier ID", value: "SU001" },
              ].map(({ label, value }) => (
                <Grid item xs={12} sm={6} key={label}>
                  <Typography variant="h6" component="h3">
                    {label}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
