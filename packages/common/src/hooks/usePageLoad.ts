import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { PageName, uiActions } from "../store";

const usePageLoad = (pageName: PageName): void => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(uiActions.pageLoad(pageName));
  }, [dispatch, pageName]);
};

export const useLazyPageLoad = (pageName: PageName): (() => void) => {
  const dispatch = useDispatch();
  const trigger = useCallback(() => {
    dispatch(uiActions.pageLoad(pageName));
  }, [dispatch, pageName]);
  return trigger;
};

export default usePageLoad;

