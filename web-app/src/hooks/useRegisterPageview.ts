/* eslint-disable no-restricted-globals */
import { useEffect } from "react";
import ReactGA from "react-ga";

const GTAG_DEFAULT_CATEGORY = "(not set)";
const PAGE_VIEW_ACTION = "page_view";

export const registerEvent = (event: string): void => {
  ReactGA.event({
    category: GTAG_DEFAULT_CATEGORY,
    action: event,
  });
};

export const registerPageView = (pageTitle: string): void => {
  ReactGA.set({ page_title: pageTitle, page_location: location.href });
  ReactGA.event({
    category: GTAG_DEFAULT_CATEGORY,
    action: PAGE_VIEW_ACTION,
  });
};

const useRegisterPageView = (pageTitle: string): void => {
  useEffect(() => {
	registerPageView(pageTitle);
  }, [pageTitle]);
};

export default useRegisterPageView;
