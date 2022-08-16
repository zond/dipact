import { createAction } from "@reduxjs/toolkit";

const prefix = "views";

const initializeMapView = createAction<string>(`${prefix}/initializeMapView`);
const initializeOrdersView = createAction<string>(`${prefix}/initializeOrders`);

export const actions = {
  initializeMapView,
  initializeOrdersView,
};
