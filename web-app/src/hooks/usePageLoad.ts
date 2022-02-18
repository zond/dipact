import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

import { actions as uiActions, PageName } from "../store/ui";

const usePageLoad = (pageName: PageName, data?: any): void => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(uiActions.pageLoad({ pageName, data }));
  }, [dispatch, pageName, data]);
};

export const useLazyPageLoad = (pageName: PageName): ((data?: any) => void) => {
  const dispatch = useDispatch();
  const trigger = useCallback((data?: any) => {
    dispatch(uiActions.pageLoad({ pageName, data }));
  }, [dispatch, pageName]);
  return trigger;
};

export default usePageLoad;
