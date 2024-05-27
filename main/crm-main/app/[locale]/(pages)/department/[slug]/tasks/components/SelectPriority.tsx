import { FormError } from "@/components/ui/FormError/FormError";
import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";

interface props {
  tranlateObj: any;
  setNewTask: (value: any) => void;
  newTask: any;
  priority: string;
  errors: any;
}

export default function SelectPriority(props: props) {
  const dispatch = useDispatch();
  const handleChangePriority = (event: SelectChangeEvent) => {
    props.setNewTask((prevState: any) => ({
      ...prevState,
      ["priority"]: event.target.value,
    }));
    dispatch({ payload: 4, type: "VerticalSteperSlice/setActiveStep" });
  };

  return (
    <Grid container display={"flex"} width={"100%"} spacing={1}>
      <Grid item xs={12} md={2.7}>
        <Box
          sx={{
            display: "flex",
            marginTop: "1.6rem",
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
              color: "#222222",
              display: "flex",
              alignItems: "end",
            }}
          >
            {props.tranlateObj.priority}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={9.3}>
        <FormControl
          focused={false}
          fullWidth
          sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Select
            autoFocus={false}
            id="demo-simple-select-helper"
            margin="dense"
            name="priority"
            value={props.priority ? props.priority : "low"}
            defaultValue={
              props.newTask.priority ? props.newTask.priority : "low"
            }
            onChange={handleChangePriority}
            variant="standard"
            sx={{
              width: "100%",
            }}
          >
            <MenuItem disabled value="">
              <em>{props.tranlateObj.priority}</em>
            </MenuItem>

            <MenuItem value={"low"}>{props.tranlateObj.low}</MenuItem>
            <MenuItem value={"medium"}>{props.tranlateObj.medium}</MenuItem>
            <MenuItem value={"high"}>{props.tranlateObj.high}</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {props.errors.priority && (
        <Grid item xs={12}>
          {" "}
          <FormError error={props.errors.priority} />
        </Grid>
      )}
    </Grid>
  );
}
