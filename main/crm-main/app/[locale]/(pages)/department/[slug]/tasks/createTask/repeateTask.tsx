import { MultipleDatePicker } from "@/components/settings/Items/MultipleDatePicker";
import { CustumButton } from "@/components/ui/Button/CustumButton";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import type { Dayjs } from "dayjs";
import { useState } from "react";

interface IProps {
  tranlateObj: any;
  onChange: (dates: Dayjs[]) => void;
}

export const DatePickerModal = (props: IProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);
  const [disabled, setDisabled] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseDialogSteper = () => {
    setIsModalVisible(false);
  };

  const handleSaveDates = () => {
    props.onChange(selectedDates);
    setIsModalVisible(false);
  };

  return (
    <>
      <CustumButton
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          width: "100%",
          maxWidth: "300px",
        }}
        label={props.tranlateObj.Repeat}
        onClick={() => showModal()}
      />
      <Dialog
        open={isModalVisible}
        onClose={() => handleCloseDialogSteper()}
        sx={{
          overscrollBehavior: "contain",
          overflow: "visible",
          padding: 2,
        }}
        autoFocus={true}
      >
        <DialogTitle
          sx={{
            fontSize: "1.2rem",
            fontWeight: 600,
            color: "#222222",
          }}
        >
          {props.tranlateObj.seletct_dates}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontSize: "1rem",
              fontWeight: 500,
              color: "#222222",
              display: "flex",
              alignItems: "end",
              marginBottom: 2,
            }}
          >
            {props.tranlateObj.repeat_disc}
          </DialogContentText>
          <MultipleDatePicker
            onChange={(dates) => {
              if (!dates) {
                setSelectedDates([]);
                return;
              }
              setSelectedDates(dates);
            }}
          />
        </DialogContent>
        <DialogActions>
          <CustumButton
            onClick={() => handleCloseDialogSteper()}
            label={props.tranlateObj.cancel_button}
          />
          <CustumButton
            disabled={disabled}
            onClick={() => {
              handleSaveDates();
              setDisabled(true);
            }}
            label={props.tranlateObj.save_dates_submit}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};
