import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  FormControl,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  styled,
  Alert,
} from "@mui/material";
import { FormError } from "@/components/ui/FormError/FormError";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getWorkers } from "./utils/utils";
// import TabSelect from "@/components/ui/TabSelect/TabSelect";
import { useTranslations } from "next-intl";
import MyTabSelect from "@/components/ui/TabSelect/MyTabSelect";

const StyledInput = styled(TextField)(() => ({
  "& .MuiInputBase-root": {
    padding: "0px",
  },
}));

interface WorkerDetailsProps {
  newWorkerData: any;
  setNewWorkerData: (data: any) => void;
  WorkerErrors: any;
  workerId?: string | number;
}

const WorkerDetails: React.FC<WorkerDetailsProps> = ({
  newWorkerData,
  setNewWorkerData,
  WorkerErrors,
  workerId,
}) => {
  const t = useTranslations('worker');
  const [workerNames, setWorkerNames] = useState<
    { uid: string; name: string }[]
  >([]);
  const [workers, setWorkers] = useState<any>([]);
  const departmentId = useSelector<RootState, string>(
    (state) => state?.departmentSlice?.value?.uid
  );

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setNewWorkerData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useMemo(() => {
    if (departmentId) {
      getWorkers(departmentId)
        .then((data) => {
          if (data) {
            setWorkers(data ?? []);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [departmentId]);

  useEffect(() => {
    setWorkerNames(
      workers.map((worker: any) => {
        if (workerId) {
          if (workerId != worker.uid)
            return {
              uid: worker.uid,
              name: worker.first_name + " " + worker.last_name,
            };
        } else
          return {
            uid: worker.uid,
            name: worker.first_name + " " + worker.last_name,
          };
      })
    );
  }, [workers, workerId]);

  const onSelectWorker = (value: any | null) => {
    setNewWorkerData({
      ...newWorkerData,
      ["supervisor_id"]: value ? value.uid : "",
    });
  };

  return (
    <>
      <Box
        display={"flex"}
        gap={"1rem"}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        <Box width={"100%"}>
          <FormControl fullWidth sx={{ marginTop: 1 }}>
            <InputLabel id="gender-label">{t('gender')}</InputLabel>
            <Select
              labelId="gender-label"
              id="gender-select"
              margin="dense"
              fullWidth
              name="gender"
              value={newWorkerData.gender}
              onChange={handleInputChange}
            >
              <MenuItem value="male">{t('male')}</MenuItem>
              <MenuItem value="female">{t('female')}</MenuItem>
            </Select>
          </FormControl>
          {WorkerErrors.gender && <FormError error={WorkerErrors.gender} />}
        </Box>
        <Box width={"100%"}>
          

          <MyTabSelect
            itemsList={workerNames}
            onSelect={onSelectWorker}
            placeholder={
              workers
                .map((worker: any) =>
                  newWorkerData.supervisor_id == worker.uid
                    ? worker.first_name + " " + worker.last_name
                    : ""
                )
                .filter((obj: any) => obj != "")[0] ?? t('select-supervisor')
            }
            variant="standard"
          />
        </Box>
        
      </Box>

      <Box width={"100%"} sx={{marginTop:'6px'}}>
        {workers.length == 0 && (
            <Alert variant="standard" color="info">
              {t('create-a-worker-to-assign-as-a-supervisor')} </Alert>
          )}
          </Box>
      <Box
        display={"flex"}
        gap={"1rem"}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        <Box width={"100%"}>
          <TextField
            fullWidth
            label={t('address')}
            name="address"
            value={newWorkerData.address}
            onChange={handleInputChange}
            InputLabelProps={{ required: false }}
          />
          {WorkerErrors.address && <FormError error={WorkerErrors.address} />}
        </Box>
      </Box>
      <Box
        display={"flex"}
        gap={"1rem"}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        <Box width={"100%"}>
          <TextField
            fullWidth
            label={t('zip-code')}
            name="zip_code"
            value={newWorkerData.zip_code}
            onChange={handleInputChange}
            InputLabelProps={{ required: false }}
          />
          {WorkerErrors.zip_code && <FormError error={WorkerErrors.zip_code} />}
        </Box>

        <Box width={"100%"}>
          <TextField
            fullWidth
            label={t('city')}
            name="city"
            value={newWorkerData.city}
            InputLabelProps={{ required: false }}
            onChange={handleInputChange}
          />
          {WorkerErrors.city && <FormError error={WorkerErrors.city} />}
        </Box>
      </Box>
      <Box
        display={"flex"}
        gap={"1rem"}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        <Box width={"100%"}>
          <TextField
            fullWidth
            label={t('state-province')}
            name="state_province"
            value={newWorkerData.state_province}
            onChange={handleInputChange}
            InputLabelProps={{ required: false }}
          />
          {WorkerErrors.state_province && (
            <FormError error={WorkerErrors.state_province} />
          )}
        </Box>

        <Box width={"100%"}>
          <TextField
            fullWidth
            label={t('country')}
            name="country"
            value={newWorkerData.country}
            onChange={handleInputChange}
            InputLabelProps={{ required: false }}
          />
          {WorkerErrors.country && <FormError error={WorkerErrors.country} />}
        </Box>
      </Box>

      <Box
        display={"flex"}
        gap={"1rem"}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        <Box width={"100%"}>
          <TextField
            fullWidth
            label={t('job_title')}
            name="job_position"
            value={newWorkerData.job_position}
            onChange={handleInputChange}
            InputLabelProps={{ required: false }}
          />
          {WorkerErrors.job_position && (
            <FormError error={WorkerErrors.job_position} />
          )}
        </Box>
      </Box>

      <Box
        display={"flex"}
        gap={"1rem"}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        <Box width={"100%"}>
          <TextField
            fullWidth
            label={t('employment-date')}
            name="employment_date"
            type="date"
            InputLabelProps={{ shrink: true, required: false }}
            value={newWorkerData.employment_date}
            onChange={handleInputChange}
          />
          {WorkerErrors.employment_date && (
            <FormError error={WorkerErrors.employment_date} />
          )}
        </Box>

        <Box width={"100%"}>
          <TextField
            fullWidth
            label={t('date-of-birth')}
            name="date_of_birth"
            type="date"
            InputLabelProps={{ shrink: true, required: false }}
            value={newWorkerData.date_of_birth}
            onChange={handleInputChange}
          />
          {WorkerErrors.date_of_birth && (
            <FormError error={WorkerErrors.date_of_birth} />
          )}
        </Box>
      </Box>

      <Box
        display={"flex"}
        gap={"1rem"}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        <Box width={"100%"}>
          <TextField
            fullWidth
            label={t('security-number')}
            name="security_number"
            value={newWorkerData.security_number}
            onChange={handleInputChange}
            InputLabelProps={{ required: false }}
          />
          {WorkerErrors.security_number && (
            <FormError error={WorkerErrors.security_number} />
          )}
        </Box>

        <Box width={"100%"}>
          <TextField
            fullWidth
            label={t('licence-number')}
            name="licence_number"
            value={newWorkerData.licence_number}
            onChange={handleInputChange}
            InputLabelProps={{ required: false }}
          />
          {WorkerErrors.licence_number && (
            <FormError error={WorkerErrors.licence_number} />
          )}
        </Box>
      </Box>

      <Box
        display={"flex"}
        gap={"1rem"}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
      >
        <Box width={"100%"}>
          <StyledInput
            autoFocus={false}
            margin="dense"
            label={"notes"}
            type="text"
            name="notes"
            value={newWorkerData.notes}
            onChange={handleInputChange}
            rows={2}
            multiline
            InputLabelProps={{ required: false }}
            fullWidth
          />
          {WorkerErrors.notes && <FormError error={WorkerErrors.notes} />}
        </Box>
      </Box>
    </>
  );
};

export default WorkerDetails;
