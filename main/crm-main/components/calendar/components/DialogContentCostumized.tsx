import TaskTimeline from "@/components/ui/TaskTimeline";
import MapModel from "@/app/[locale]/(pages)/department/[slug]/tasks/[taskId]/MapModel";
import TaskImages from "@/app/[locale]/(pages)/department/[slug]/tasks/[taskId]/TaskImages";
import TaskPrice from "@/app/[locale]/(pages)/department/[slug]/tasks/[taskId]/TaskPrice";
import {
  DialogContent,
  TextField,
  Typography,
  Grid,
  Box,
  Avatar,
  Paper,
  Link,
} from "@mui/material";

const DialogContentCostumized = ({ event }: { event: any }) => {
  const datee = "2024-04-01T04:00:00.000Z";
  const taskData = {
    title: "task title",
    description:
      "task description task description task description task description task description task description task description task description",
    worker: "worker name",
    created_at: new Date(datee),
    super_admin: "super admin name",
  };

  return (
    <DialogContent
      sx={{
        width: "100dvw",
        height: "50dvh",
        maxWidth: "100%",
        maxHeight: "100%",
      }}
    >
      <Grid container sx={{ width: "100%", gap: 2 }}>
        <Grid item xs={10} mt={".4rem"}>
          <TaskTimeline
            start_date={"2022-01-01T00:00:00.000Z"}
            end_date={"2024-10-13"}
          />
        </Grid>

        <Grid item xs={12}>
          <Paper>
            <Grid xs={12} margin={0.5}>
              <Typography variant="h6">
                Worker:
              </Typography>
            </Grid>
            <Grid item xs={12} marginX={2}>
              <Grid container display={'flex'} alignItems={'center'}>
                <Grid item xs={2}>
                  <Avatar sx={{ width: "50px", height: "50px" }}></Avatar>
                </Grid>
                <Grid item xs={8}>
                    <Typography variant="h6">
                      <b>{taskData.worker}</b>
                    </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <TaskPrice
            taskPrice={10000000}
            taskCosts={[]}
            sx={{ mt: "0px !important" }}
          />
        </Grid>
      </Grid>
    </DialogContent>
  );
};

export default DialogContentCostumized;
