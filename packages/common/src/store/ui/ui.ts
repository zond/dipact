import { createAction } from "@reduxjs/toolkit";
import { PageName } from "./ui.types";

const pageLoad = createAction<PageName>("ui/pageLoad");

export const uiActions = {
  pageLoad,
};
