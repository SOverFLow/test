import { Grid, Typography } from "@mui/material";
import { cyan } from "@mui/material/colors";

export default function TableHeader(props: {
  items: string[];
  sizes?: number[];
}) {
  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: cyan[50],
        borderTop: "1px solid grey",
        py: 1,
        px: 2,
        mb: 0,
      }}
    >
      {props.items.map((item, index) => (
        <Grid
          key={item + index}
          item
          xs={props.sizes ? props.sizes[index] : 12 / item.length}
        >
          <Typography>{item}</Typography>
        </Grid>
      ))}
    </Grid>
  );
}
