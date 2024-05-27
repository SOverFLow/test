import { RootState } from "@/store";
import { setAddress } from "@/store/addressSlice";
import { Grid, List, ListItem, ListItemText, TextField } from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface props {
  tranlateObj: any;
  onAddressChange: (address: string) => void;
}

export default function AddressField(props: props) {
  const textFieldRef = useRef(null);
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState([]);
  const address = useSelector(
    (state: RootState) => state?.addressReducer?.address
  );

  const handleAddressChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    dispatch(setAddress(input));

    if (input.length > 1) {
      await axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            input
          )}.json?access_token=${
            process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
          }&limit=5`
        )
        .then((response) => {
          setSuggestions(response.data.features);
        })
        .catch((error) => console.log("Error:", error));
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyPress = async (event: any) => {
    if (event.key === "Enter") {
      const input = event.target.value;
      dispatch(setAddress(input));
      props.onAddressChange(input);
      setSuggestions([]);
      await axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            input
          )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
        )
        .then((response) => {
          //   setnewLatitude(parseFloat(response.data.features[0].center[1]));
          //   setLongitude(parseFloat(response.data.features[0].center[0]));
        })
        .catch((error) => console.log("Error:", error));
    }
  };

  const handleSuggestionClick = async (suggestion: any) => {
    dispatch(setAddress(suggestion.place_name));
    dispatch({ payload: 2, type: "VerticalSteperSlice/setActiveStep" });
    props.onAddressChange(suggestion.place_name);
    setSuggestions([]);
    await axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          suggestion.place_name
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      )
      .then((response) => {
        // setnewLatitude(parseFloat(response?.data?.features[0]?.center[1]));
        // setLongitude(parseFloat(response?.data?.features[0]?.center[0]));
      })
      .catch((error) => console.log("Error:", error));
  };

  

  return (
    <Grid
      item
      xs={12}
      md={9.5}
      marginTop={"0rem"}
      width={"100%"}
      flexDirection={"column"}
      position={"relative"}
    >
      <TextField
        ref={textFieldRef}
        autoFocus={false}
        margin="dense"
        hiddenLabel
        type="text"
        name="address"
        placeholder={props.tranlateObj.address}
        value={address}
        onChange={handleAddressChange}
        onKeyDown={handleKeyPress}
        sx={{
          width: "100%",
          position: "relative",
        }}
        variant="standard"
      />
      {suggestions.length > 0 && (
        <List
          component="nav"
          style={{
            maxHeight: "190px",
            overflowY: "auto",
            backgroundColor: "#F9F9F9",
            zIndex: 500,
            width: "100%",
            top: "100%",
            height: "auto",
            position: "absolute",
            border: "1px solid #E0E0E0",
            borderRadius: "0.3rem",
          }}
        >
          {suggestions.map((suggestion: any, index) => (
            <ListItem
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#BDC4CF",
                  fontWeight: 700,
                  color: "#fff",
                },
              }}
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <ListItemText primary={suggestion.place_name} />
            </ListItem>
          ))}
        </List>
      )}
    </Grid>
  );
}
