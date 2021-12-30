import { createAction } from "@reduxjs/toolkit";
import { CreateGameFormValues } from "./types";

const domain = "ui";

const submitCreateGameForm = createAction<CreateGameFormValues>(
  `${domain}/submitCreateGameForm`
);

export const actions = {
  submitCreateGameForm,
};
