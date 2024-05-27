export const setAddress = (address: string) => ({
  type: "SET_ADDRESS",
  payload: address,
});

const initialState = {
  address: "",
};

const addressReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_ADDRESS":
      return { ...state, address: action.payload };
    default:
      return state;
  }
};

export default addressReducer;
