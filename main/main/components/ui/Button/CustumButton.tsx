import { Button } from "@mui/material";

interface CustumButtonProps {
  label: any;
  onClick: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
  isDisabled?: boolean;
}
export function CustumButton(props: CustumButtonProps) {
  return (
    <Button
      disabled={props.isDisabled || props.disabled}
      aria-label="Name"
      variant="contained"
      onClick={props.onClick}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "4px",
        color: "#fff",
        textTransform: "none",
      }}
      title="button"
      style={props.style}
    >
      {props.label}
    </Button>
  );
}
