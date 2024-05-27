import { FormError } from "@/components/ui/FormError/FormError";
import { TabSelect } from "@/components/ui/OldTabSelect/TabSelect";
import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";

interface props {
  tranlateObj: any;
  newTask: any;
  setNewTask: any;
  errors: any;
}

export default function Selectstatus(props: props) {
  const [statusNames, setStatusNames] = useState<any[]>([
    "In Progress",
    "Done",
    "Pending",
    "Delayed",
  ]);

  const onSelectStatus = (value: string | null) => {
    if (value) {
      value === "Pending" &&
        props.setNewTask({ ...props.newTask, ["status"]: "pending" });
      value === "In Progress" &&
        props.setNewTask({ ...props.newTask, ["status"]: "in_progress" });
      value === "Done" &&
        props.setNewTask({ ...props.newTask, ["status"]: "done" });
      value === "Delayed" &&
        props.setNewTask({ ...props.newTask, ["status"]: "delayed" });
    }
  };

  return (
    <Grid container display={"flex"} width={"100%"} spacing={1}>
      <Grid item md={2.7} xs={12}>
        <Box
          sx={{
            display: "flex",
            marginTop: "1.6rem",
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "0.9rem",
              color: "#222222",
              display: "flex",
              alignItems: "end",
            }}
          >
            {props.tranlateObj.status}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={9.3}>
        <TabSelect
          default={"In Progress"}
          itemsList={statusNames}
          onSelect={onSelectStatus}
          placeholder={props.tranlateObj.status}
          variant="standard"
        />
      </Grid>

      {props.errors.status && (
        <Grid item xs={12}>
          {" "}
          <FormError error={props.errors.status} />
        </Grid>
      )}
    </Grid>
  );
}
