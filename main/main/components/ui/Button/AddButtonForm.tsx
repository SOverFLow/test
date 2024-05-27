import { Button } from "@mui/material";
import { blue } from "@mui/material/colors";

interface AddButtonFormProps {
  label: any;
  onClick: () => void;
  content?: string;
  backgroundColor?: string;
  style?: React.CSSProperties;
}
export function AddButtonForm(props: AddButtonFormProps) {
  return (
    <Button
      aria-label="Name"
      variant="contained"
      onClick={props.onClick}
      color="inherit"
      sx={{
        textTransform: "none",
        marginTop: "10px",
        marginLeft: "10px",
        backgroundColor: props.backgroundColor
          ? props.backgroundColor
          : "transparent",
        color: "#4CC4D3",
        ":hover": {
          backgroundColor: "#4CC4D3",
          color: "#fff",
        },
      }}
      style={props.style}
      title="button"
      content={props.content}
      autoFocus={false}
    >
      {props.label}
    </Button>
  );
}
