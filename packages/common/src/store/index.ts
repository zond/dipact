import { feedbackSelectors } from "./feedback";
import * as mainSelectors from "./selectors";

export const selectors = { ...mainSelectors, feedback: feedbackSelectors };

// TODO tighten all this
export * from "./store";
export * from "./types";
export * from "./testData";
export { actions as authActions } from "./auth";
export { actions as feedbackActions } from "./feedback";
export { actions as phaseActions } from "./phase";
export { actions as uiActions, PageName } from "./ui";
export { ReduxWrapper } from "./testUtils";
export {
  diplicityService,
  diplicityServiceURL,
  ListGameFilters,
} from "./service";
