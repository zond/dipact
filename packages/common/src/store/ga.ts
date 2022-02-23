import { createAction } from "@reduxjs/toolkit";

const domain = "ga";

const registerPageView = createAction<string>(`${domain}/pageLoad`);

export const actions = {
  registerPageView,
};
