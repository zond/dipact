import { createAction } from "@reduxjs/toolkit";

const prefix = "views";

const initializeOrdersView = createAction<string>(`${prefix}/initializeOrders`);

export const actions = {
  initializeOrdersView,
};
