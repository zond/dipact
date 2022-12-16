import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateOrder, OrderType } from "./types";

const initialState: CreateOrder = {};

const createOrderSlice = createSlice({
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

export const actions = createOrderSlice.actions;

export default createOrderSlice.reducer;
