import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { calcTTC } from "./EstimatedPrice";

interface props {
  products: any[];
  onDelete: (uid: string) => void;
  disabled?: boolean;
  currency?: string;
}

const ProductCard = ({
  product,
  onDelete,
  disabled,
  currency,
}: {
  product: any;
  onDelete: (uid: string) => void;
  disabled?: boolean;
  currency?: string;
}) => {
  return (
    <Card sx={{ position: "relative", width: 120, m: 2 }}>
      <IconButton
        onClick={() => {
          onDelete(product.uid);
        }}
        sx={{ position: "absolute", top: 0, right: 0, color: "red" }}
      >
        <DeleteIcon />
      </IconButton>
      <CardMedia
        component="img"
        height="75"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: "contain" }}
      />
      <CardContent>
        <Typography
          gutterBottom
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "0.8rem",
            fontWeight: "bold",
          }}
          component="div"
        >
          {product.name}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: "text.primary",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          (
          {calcTTC(
            parseFloat(product?.sell_price),
            parseFloat(product?.sell_tva?.value)
          )}{" "}
          {currency})
        </Typography>
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: "text.secondary",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          color="text.secondary"
        >
          Quantity: {product.quantity}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ProductList = ({ products, onDelete, disabled, currency }: props) => {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      {products.map((product, index) => (
        <ProductCard
          key={index}
          product={product}
          onDelete={onDelete}
          disabled={disabled}
          currency={currency}
        />
      ))}
    </Box>
  );
};

export default ProductList;
