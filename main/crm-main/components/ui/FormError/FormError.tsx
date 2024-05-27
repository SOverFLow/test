import { Box } from "@mui/material";

interface FormErrorProps {
  error: string;
}
export function FormError(props: FormErrorProps) {
  return (
    <Box
      component={"span"}
      sx={{
        color: "red",
        fontSize: "0.7rem",
        margin: "4px 0px",
        marginLeft: "9px",
      }}
    >
      {props.error}
    </Box>
  );
}
