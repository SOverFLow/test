import { TextField, Grid, Typography, Box } from "@mui/material";
import { FormError } from "@/components/ui/FormError/FormError";

interface ProductDetailsProps {
  newProductData: any;
  setNewProductData: (data: any) => void;
  ProductErrors: any;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  newProductData,
  setNewProductData,
  ProductErrors,
}) => {
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    if (
      name == "weight" ||
      name == "length" ||
      name == "width" ||
      name == "height" ||
      name == "area" ||
      name == "volume"
    ) {
      setNewProductData((prevData: any) => ({
        ...prevData,
        [name]: parseFloat(value),
      }));
      return;
    }
    setNewProductData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Box sx={{mt: ".5rem"}}>
      <Typography variant="h6">Product Details:</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Weight"
            name="weight"
            type="text"
            value={newProductData.weight}
            onChange={handleInputChange}
            InputLabelProps={{ required: false }}
          />
          {ProductErrors.weight && <FormError error={ProductErrors.weight} />}
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Length"
            name="length"
            type="text"
            value={newProductData.length}
            onChange={handleInputChange}
            InputLabelProps={{ required: false }}
          />
          {ProductErrors.length && <FormError error={ProductErrors.length} />}
        </Grid>
        </Grid>
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Width"
            name="width"
            type="text"
            value={newProductData.width}
            onChange={handleInputChange}
            InputLabelProps={{ required: false }}
          />
          {ProductErrors.width && <FormError error={ProductErrors.width} />}
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Height"
            name="height"
            type="text"
            value={newProductData.height}
            onChange={handleInputChange}
            InputLabelProps={{ required: false }}
          />
          {ProductErrors.height && <FormError error={ProductErrors.height} />}
        </Grid>
        </Grid>
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Area"
            type="text"
            name="area"
            value={newProductData.area}
            onChange={handleInputChange}
            InputLabelProps={{ required: false }}
          />
          {ProductErrors.area && <FormError error={ProductErrors.area} />}
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Volume"
            name="volume"
            type="text"
            value={newProductData.volume}
            onChange={handleInputChange}
            InputLabelProps={{ required: false }}
          />
          {ProductErrors.volume && <FormError error={ProductErrors.volume} />}
        </Grid>
        </Grid>
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Country of Origin"
            name="country_of_origin"
            value={newProductData.country_of_origin}
            onChange={handleInputChange}
            InputLabelProps={{ required: false }}
          />
          {ProductErrors.country_of_origin && (
            <FormError error={ProductErrors.country_of_origin} />
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="State/Province of Origin"
            name="state_province_of_origin"
            value={newProductData.state_province_of_origin}
            onChange={handleInputChange}
            InputLabelProps={{ required: false }}
          />
          {ProductErrors.state_province_of_origin && (
            <FormError error={ProductErrors.state_province_of_origin} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetails;
