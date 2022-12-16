import { createAction } from "@reduxjs/toolkit";

const domain = "ga";

const registerPageView = createAction<string>(`${domain}/pageLoad`);
const registerEvent = createAction<string>(`${domain}/event`);

export const actions = {
  registerPageView,
  registerEvent,
};
