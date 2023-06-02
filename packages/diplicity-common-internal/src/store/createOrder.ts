import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateOrder, OrderType } from "./types";

const initialState: CreateOrder = {};

export const createOrderSlice = createSlice({
  name: "createOrder",
  initialState,
  reducers: {
    clear: () => {
      return { ...initialState };
    },
    setSource: (state, { payload }: PayloadAction<string>) => {
      return { ...state, source: payload };
    },
    setType: (state, { payload }: PayloadAction<OrderType>) => {
      return { ...state, type: payload };
    },
    setTarget: (state, { payload }: PayloadAction<string>) => {
      return { ...state, target: payload };
    },
    setAux: (state, { payload }: PayloadAction<string>) => {
      return { ...state, aux: payload };
    },
  },
});

export const createOrderActions = createOrderSlice.actions;
export const createOrderReducer = createOrderSlice.reducer;
export const createOrderSelectors = {
  selectcreateOrder: createSelector(
    (state: { createOrder: CreateOrder }) => state.createOrder,
    (createOrder) => createOrder
  ),
};
