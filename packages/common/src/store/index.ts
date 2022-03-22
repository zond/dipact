import auth from "./auth";
import colorOverrides from "./colorOverrides";
import feedback from "./feedback";
import messaging from "./messaging";
import phase from "./phase";
import { diplicityService } from "./service";
import { feedbackSelectors } from "./feedback";
import * as mainSelectors from "./selectors";

export const reducers = {
  auth,
  colorOverrides,
  [diplicityService.reducerPath]: diplicityService.reducer,
  feedback,
  messaging,
  phase,
};

export const selectors = { ...mainSelectors, feedback: feedbackSelectors };

// TODO tighten all this
export * from "./types";
export * from "./testData";
export { actions as authActions } from "./auth";
export { actions as gaActions } from "./ga";
export { actions as feedbackActions } from "./feedback";
export { actions as phaseActions } from "./phase";
export { actions as uiActions, PageName } from "./ui";
export { ReduxWrapper } from "./testUtils";
export {
  diplicityService,
  diplicityServiceURL,
  ListGameFilters,
} from "./service";
export { default as middleware } from "./middleware";
