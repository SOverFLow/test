import { MultipleDatePicker } from "@/components/settings/Items/MultipleDatePicker";
import { FormError } from "@/components/ui/FormError/FormError";
import {
  Box,
  Divider,
  FormControl,
  MenuItem,
  Select,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { MuiColorInput } from "mui-color-input";
import React from "react";
import PickerTime from "../components/TimePicker";
import "@/styles/multipleDatePicker.css";

const StyledInput = styled(TextField)(() => ({
  "& .MuiInputBase-root": {
    padding: "0px",
  },
}));

interface CreateTaskFirstStepProps {
  tranlateObj: any;
  newTaskData: any;
  setNewTaskData: (data: any) => void;
  TaskErrors: any;
  NormalDatePicker?: boolean;
}

const CreateTaskFirstStep: React.FC<CreateTaskFirstStepProps> = ({
  tranlateObj,
  newTaskData,
  setNewTaskData,
  TaskErrors,
  NormalDatePicker = true,
}) => {
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    if (name == "hours_day" || name == "hours_night") {
      setNewTaskData((prevState: any) => ({
        ...prevState,
        [name]: parseFloat(value),
      }));
      return;
    }
    setNewTaskData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCustomHoursChange = (time: any) => {
    setNewTaskData((prevState: any) => {
      const newStartDate = new Date(prevState.start_date);
      const newEndDate = new Date(prevState.end_date);
      console.log("date++", prevState.start_date, prevState.end_date);
      newStartDate.setHours(new Date(time[0]).getHours());
      newStartDate.setMinutes(new Date(time[0]).getMinutes());
      newEndDate.setHours(new Date(time[1]).getHours());
      newEndDate.setMinutes(new Date(time[1]).getMinutes());

      return {
        ...prevState,
        start_date: newStartDate,
        end_date: newEndDate,
        ["start_hour"]: new Date(time[0]),
        ["end_hour"]: new Date(time[1]),
      };
    });
  };

  const handleColor = (newValue: any) => {
    setNewTaskData((prevState: any) => ({
      ...prevState,
      ["color"]: newValue,
    }));
  };

  return (
    <Box
      sx={{
        gap: "0.5rem",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Box
        display={"flex"}
        gap={{ xs: "0.4rem", md: "1rem" }}
        sx={{
          marginTop: "0.5rem",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "0.9rem",
            color: "#222222",
            display: "flex",
            alignItems: "end",
            width: {
              xs: "100%",
              md: "18%",
            },
          }}
        >
          {tranlateObj.title}
        </Typography>
        <TextField
          hiddenLabel
          autoFocus={false}
          margin="dense"
          placeholder={tranlateObj.title}
          type="text"
          name="title"
          value={newTaskData.title ? newTaskData.title : ""}
          onChange={handleInputChange}
          variant="standard"
          sx={{
            width: { xs: "100%", md: "80%" },
          }}
        />
      </Box>

      {TaskErrors.title && <FormError error={TaskErrors.title} />}

      <Box
        display={"flex"}
        gap={{ xs: "0.4rem", md: "1rem" }}
        sx={{
          flexDirection: { xs: "column", md: "row" },
          marginBottom: "0.2rem",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "0.9rem",
            color: "#222222",
            display: "flex",
            alignItems: "end",
            width: {
              xs: "100%",
              md: "18%",
            },
          }}
        >
          {tranlateObj.description}
        </Typography>
        <Box sx={{ width: { xs: "100%", md: "80%" } }}>
          <TextArea
            rows={2}
            placeholder={tranlateObj.description}
            value={newTaskData.description ? newTaskData.description : ""}
            maxLength={200}
            name="description"
            onChange={handleInputChange}
          />
        </Box>
      </Box>

      {TaskErrors.description && <FormError error={TaskErrors.description} />}

      <Box
        display={"flex"}
        gap={{ xs: "0.4rem", md: "1rem" }}
        sx={{
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "0.9rem",
            color: "#222222",
            display: "flex",
            alignItems: "end",
            width: {
              xs: "100%",
              md: "18%",
            },
          }}
        >
          {tranlateObj.color}
        </Typography>
        <Box
          sx={{
            width: { xs: "100%", md: "80%" },
          }}
        >
          <MuiColorInput
            format="hex"
            value={newTaskData?.color}
            onChange={handleColor}
            variant="standard"
          />
        </Box>
      </Box>

      <FormControl fullWidth>
        <Box
          display={"flex"}
          gap={{ xs: "0.4rem", md: "1rem" }}
          sx={{
            flexDirection: { xs: "column", md: "row" },
            marginBottom: "1rem",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "0.9rem",
              color: "#222222",
              display: "flex",
              alignItems: "end",
              width: {
                xs: "100%",
                md: "18%",
              },
            }}
          >
            {tranlateObj.task_type}
          </Typography>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            margin="dense"
            variant="standard"
            name="task_type"
            value={newTaskData.task_type ? newTaskData.task_type : "hours"}
            defaultValue={"hours"}
            onChange={handleInputChange}
            sx={{
              width: { xs: "100%", md: "80%" },
            }}
            autoFocus={false}
          >
            <MenuItem value={"hours"}>{tranlateObj.Task_per_Hours}</MenuItem>
            <MenuItem value={"days"}>{tranlateObj.Task_per_Days}</MenuItem>
          </Select>
        </Box>
      </FormControl>

      {TaskErrors.task_type && <FormError error={TaskErrors.task_type} />}

      {/* Time & location Section */}

      <Box
        sx={{ display: "flex", justifyContent: "start", marginTop: "0.8rem" }}
      >
        <Typography
          sx={{
            fontWeight: 650,
            fontSize: "1rem",
            color: "rgba(0, 0, 0, 1)",
            display: "flex",
            alignItems: "end",
          }}
        >
          2. {tranlateObj.info_location}
        </Typography>
      </Box>
      <Divider
        sx={{
          marginTop: "0rem",
          marginBottom: { xs: "0.5rem", md: "0.5rem" },
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
      />
      <Box
        display={"flex"}
        gap={{ xs: "0.3rem", md: "1rem" }}
        sx={{
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
        }}
        marginBottom="0.5rem"
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "0.9rem",
            color: "#222222",
            display: "flex",
            alignItems: "end",
            width: {
              xs: "100%",
              md: "18%",
            },
          }}
        >
          {tranlateObj.date}
        </Typography>
        {NormalDatePicker && (
          <Box
            sx={{
              display: "flex",
              width: { xs: "100%", md: "80%" },
            }}
          >
            <DatePicker
              placeholder="Select Date for Task"
              format="DD/MM/YYYY"
              value={dayjs(newTaskData.start_date)}
              width={"100%"}
              style={{
                boxShadow: "none",
                width: "100%",
              }}
              popupStyle={{
                zIndex: 9999,
              }}
              onChange={(value: any) => {
                setNewTaskData((prevState: any) => ({
                  ...prevState,
                  ["start_date"]: value && new Date(value ?? new Date()),
                  ["end_date"]: value && new Date(value ?? new Date()),
                }));
              }}
            />
          </Box>
        )}
        {!NormalDatePicker && (
          <Box
            sx={{
              display: "flex",
              width: { xs: "100%", md: "80%" },
              zIndex: 450000,
            }}
          >
            <MultipleDatePicker
              defaultDates={[dayjs(newTaskData.start_date)]}
              onChange={(dates) => {
                console.log("dates", dates);
                if (!dates) {
                  setNewTaskData((prevState: any) => ({
                    ...prevState,
                    ["dates"]: [],
                  }));
                  return;
                }
                setNewTaskData((prevState: any) => ({
                  ...prevState,
                  ["dates"]: [...dates],
                }));
              }}
            />
          </Box>
        )}
      </Box>

      {TaskErrors.start_date && <FormError error={TaskErrors.start_date} />}

      <Box
        display={"flex"}
        gap={{ xs: "0.3rem", md: "1rem" }}
        sx={{
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: {
              xs: "100%",
              md: "18%",
            },
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
            {tranlateObj.Work_Hours}
          </Typography>
        </Box>
        <PickerTime
          value={[newTaskData.start_hour, newTaskData.end_hour]}
          onSelect={(time: any) => {
            handleCustomHoursChange(time);
          }}
        />
      </Box>

      {TaskErrors.start_hour && <FormError error={TaskErrors.start_hour} />}
      {/* {costumHours && <TimeShifts />} */}
    </Box>
  );
};

export default CreateTaskFirstStep;
