import { createAction } from "@reduxjs/toolkit";
import { CreateGameFormValues } from "./types";

const domain = "ui";

const pageLoad = createAction<string>(`${domain}/pageLoad`);
const submitCreateGameForm = createAction<CreateGameFormValues>(
  `${domain}/submitCreateGameForm`
);

export const actions = {
  pageLoad,
  submitCreateGameForm,
};
