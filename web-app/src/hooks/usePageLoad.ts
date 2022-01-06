import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { actions as uiActions } from "../store/ui";

const usePageLoad = (pageTitle: string): void => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(uiActions.pageLoad(pageTitle));
  }, []);
};

export default usePageLoad;
