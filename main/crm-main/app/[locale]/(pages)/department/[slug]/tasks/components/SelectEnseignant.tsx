import { CustumButton } from "@/components/ui/Button/CustumButton";
import { FormError } from "@/components/ui/FormError/FormError";
import theme from "@/styles/theme";
import { AddCircleOutline } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import { MultiAutocompleteWorkers } from "./MultiAutocompleteWorkers";

interface props {
  tranlateObj: any;
  newTask: any;
  setDialogOpenWorker: (value: React.SetStateAction<boolean>) => void;
  errors: any;
  Enseignants: any[];
  onSelectEnseignant: (value: any) => void;
}

export default function SelectEnseignant(props: props) {
  return (
    <Grid container display={"flex"} width={"100%"} spacing={1}>
      <Grid item xs={12} md={2.7}>
        <Box
          sx={{
            display: "flex",
            marginTop: "1.5rem",
            width: "100%",
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
            {props.tranlateObj.Select_teacher}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={9} md={6.8}>
        {/* <TabSelectTask
          itemsList={props.Enseignants}
          default={
            props.newTask.client_id !== ""
              ? props.Enseignants.find(
                  (client: any) => client.uid === props.newTask.client_id
                )
              : null
          }
          onSelect={props.onSelectEnseignant}
          placeholder={props.tranlateObj.Select_teacher}
          variant="standard"
          label=""
        /> */}

        <MultiAutocompleteWorkers
          label=""
          placeholder="Select Worker"
          workers={props.Enseignants!}
          defaultValue={props.newTask.workers}
          onSelectedValuesChange={props.onSelectEnseignant}
          variant="standard"
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
            alignItems: "center",
          }}
        >
          <CustumButton
            onClick={() => {
              props.setDialogOpenWorker(true);
            }}
            style={{
              fontSize: "0.6522rem",
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
                {props.tranlateObj.Add_teacher}
              </>
            }
          />
        </Box>
      </Grid>

      {props.errors.teacher && (
        <Grid item xs={12}>
          {" "}
          <FormError error={props.errors.teacher} />
        </Grid>
      )}
    </Grid>
  );
}
