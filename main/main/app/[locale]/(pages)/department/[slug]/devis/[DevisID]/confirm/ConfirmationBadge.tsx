import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import Fab from "@mui/material/Fab";
import CheckIcon from "@mui/icons-material/Check";
import { styled } from "@mui/material/styles";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

const LargeIcon = styled(CheckIcon)({
  fontSize: "2.5rem",
});

const LargeSaveIcon = styled(HourglassEmptyIcon)({
  fontSize: "2.5rem",
});

export default function ConfirmationBadge({
  loading,
  success,
}: {
  loading: boolean;
  success: boolean;
}) {
  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
    width: 80,
    height: 80,
  };

  return (
    <Box sx={{ m: 1, position: "relative" }}>
      <Fab aria-label="save" color="primary" sx={buttonSx}>
        {success ? <LargeIcon /> : <LargeSaveIcon />}
      </Fab>
      {loading && (
        <CircularProgress
          size={91.5}
          sx={{
            color: green[500],
            position: "absolute",
            top: -6,
            left: -6,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
}
