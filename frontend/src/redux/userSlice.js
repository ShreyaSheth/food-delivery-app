import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: true,
    currentCity: null,
    currentState: null,
    currentAddress: null,
    shopsInCity: null,
    itemsInCity: null,
    cartItems: [],
    totalAmount: 0,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload;
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
    setShopsInCity: (state, action) => {
      state.shopsInCity = action.payload;
    },
    setItemsInCity: (state, action) => {
      state.itemsInCity = action.payload;
    },
    addToCart: (state, action) => {
      if (state.cartItems.find((item) => item.id === action.payload.id)) {
        state.cartItems.find(
          (item) => item.id === action.payload.id
        ).quantity += action.payload.quantity;
      } else {
        state.cartItems.push(action.payload);
      }
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    updateCartItemQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
  },
});
export const {
  setUserData,
  setCurrentCity,
  setCurrentState,
  setCurrentAddress,
  setShopsInCity,
  setItemsInCity,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
} = userSlice.actions;
export default userSlice.reducer;
export const selectUser = (state) => ({
  ...state.user,
});
