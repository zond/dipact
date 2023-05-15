import auth from "./auth";
import colorOverrides from "./colorOverrides";
import createOrder from "./createOrder";
import feedback from "./feedback";
import game from "./game";
import messaging from "./messaging";
import phase from "./phase";
import { diplicityService } from "./service";
import { feedbackSelectors } from "./feedback";
import * as mainSelectors from "./selectors";

export const reducers = {
  auth,
  colorOverrides,
  createOrder,
  [diplicityService.reducerPath]: diplicityService.reducer,
  feedback,
  game,
  messaging,
  phase,
};

export const selectors = { ...mainSelectors, feedback: feedbackSelectors };

// TODO tighten all this
export * from "./types";
export * from "./testData";
export { actions as authActions } from "./auth";
export { actions as gaActions } from "./ga";
export { actions as gameActions } from "./game";
export { actions as feedbackActions } from "./feedback";
export { actions as phaseActions } from "./phase";
export { actions as uiActions, PageName } from "./ui";
export { actions as viewActions } from "./views";
export { ReduxWrapper } from "./testUtils";
export {
  diplicityService,
  diplicityServiceURL,
  ListGameFilters,
} from "./service";
export { default as middleware } from "./middleware";
