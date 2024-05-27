import { Grid, FormControlLabel, Radio, RadioGroup } from "@mui/material";

export default function TabRadio(props: {
  labels: string[];
  name: string;
  value: string;
  handleChange: any;
  Direction?: string;
}) {
  return (
    <Grid>
      <RadioGroup
      row={props.Direction === "row" ?? true }
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
      >
        {props.labels.map((label, index) => (
          <FormControlLabel
            key={props.name + index}
            value={label}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
    </Grid>
  );
}
