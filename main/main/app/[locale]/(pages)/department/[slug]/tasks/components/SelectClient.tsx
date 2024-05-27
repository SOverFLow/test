import { CustumButton } from "@/components/ui/Button/CustumButton";
import { FormError } from "@/components/ui/FormError/FormError";
import { TabSelectTask } from "@/components/ui/TabSelect/TabSelectTask";
import theme from "@/styles/theme";
import { AddCircleOutline } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";

interface props {
  tranlateObj: any;
  newTask: any;
  clients: any;
  setNewTask: any;
  setDialogOpenClient: (value: React.SetStateAction<boolean>) => void;
  errors: any;
}

export default function SelectClient(props: props) {
  const onSelectClient = (client: any) => {
    props.setNewTask({
      ...props.newTask,
      client_id: client?.uid,
    });
  };

  return (
    <Grid item xs={12} marginBottom={"1.5rem"}>
      <Grid
        container
        display={"flex"}
        width={"100%"}
        spacing={1}
        marginTop={"0.5rem"}
      >
        <Grid item xs={12} md={2.4}>
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
              {props.tranlateObj.Select_Client}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={9} md={7.1}>
          <TabSelectTask
            itemsList={props.clients}
            default={
              props.newTask.client_id !== ""
                ? props.clients.find(
                    (client: any) => client.uid === props.newTask.client_id
                  )
                : null
            }
            onSelect={onSelectClient}
            placeholder={props.tranlateObj.client}
            variant="standard"
            label=""
          />
        </Grid>
        <Grid
          item
          xs={3}
          md={2.5}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "end",
            }}
          >
            <CustumButton
              onClick={() => {
                props.setDialogOpenClient(true);
              }}
              style={{
                fontSize: "0.7rem",
                fontWeight: 550,
                width: "100%",
                textTransform: "none",
                color: "#fff",
                backgroundColor: theme.palette.primary.main,
                maxHeight: "2.6rem",
              }}
              label={
                <>
                  <AddCircleOutline />
                  {props.tranlateObj.Add_Client}
                </>
              }
            />
          </Box>
        </Grid>

        {props.errors.client_id && (
          <Grid item xs={12}>
            <FormError error={props.errors.client_id} />{" "}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
