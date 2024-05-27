import { FormError } from "@/components/ui/FormError/FormError";
import { Box, TextField, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import PhoneInput from "react-phone-input-2";

const CardProfileComponent = ({
  userData,
  cardTitle,
  handleChange,
  errors,
}: {
  userData: { title: string; name: string; value: string }[];
  cardTitle: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "800px",
        bgcolor: "primary.light",
        padding: "5px",
      }}
    >
      <Typography
        noWrap
        variant="h5"
        sx={{ width: "80%", m: { xs: "5px", sm: 2 }, textAlign: "left" }}
      >
        {cardTitle}
      </Typography>
      {userData?.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: "60px",
            }}
          >
            <Typography
              noWrap
              variant="subtitle1"
              sx={{ width: "25%", mx: 2, textAlign: "left" }}
            >
              {item.title}
            </Typography>
            {item.name === "phone" ? (
              <Box
                sx={{
                  width: "60%",
                  p: 0,
                  m: 0,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  backgroundColor: "white",
                }}
              >
                <PhoneInput
                  placeholder="your company phone number"
                  specialLabel=""
                  inputStyle={{
                    width: "100%",
                    border: "none",
                    backgroundColor: "white",
                    borderRadius: 0,

                    marginLeft: 0,
                    height: "2.2rem",
                    borderBottom: "1px solid " + grey[600],
                  }}
                  country={"fr"}
                  value={item.value}
                  onChange={(value, data, event, formattedValue) => {
                    const myEvent = event;
                    myEvent.target.name = "phone";
                    handleChange(myEvent);
                  }}
                />
              </Box>
            ) : (
              <TextField
                disabled={item.title === "Email"}
                size="small"
                sx={{
                  width: "60%",
                  backgroundColor: "white",
                  p: 0.5,
                  pl: 1,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                }}
                value={item.value} // Make sure this value is controlled
                variant="standard"
                name={item.name}
                onChange={handleChange}
              />
            )}
          </Box>
          <FormError error={errors[item.name]} />
        </Box>
      ))}
    </Box>
  );
};
export default CardProfileComponent;
