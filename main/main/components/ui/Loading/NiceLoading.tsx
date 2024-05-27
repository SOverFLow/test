import { Box, CircularProgress } from "@mui/material";

export function NiceLoading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100%"
    >
      <CircularProgress />
      <Box component="span" marginLeft={2}>
        Loading...
      </Box>
    </Box>
  );
}
