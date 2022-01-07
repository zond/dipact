import { useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router";
import { useEffect, useMemo } from "react";

import { actions as phaseActions } from "../store/phase";
import { useSelectPhase } from "./selectors";

// TODO test
export const useSelectPhaseQuerystringParams = (): number | null => {
  /* Selects phase from global state and also handles reading and writing to querystring params */
  const location = useLocation();
  const history = useHistory();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [
    location.search,
  ]);

  const phase = useSelectPhase();
  const dispatch = useDispatch();

  useEffect(() => {
    // If phase has been set in querystring params, set in global state
    const searchParamPhase = searchParams.get("phase");
    if (!phase && searchParamPhase) {
      dispatch(phaseActions.set(parseInt(searchParamPhase)));
    }
  }, [phase, dispatch, searchParams]);

  useEffect(() => {
    // If phase changes, update querystring params
    if (phase) {
      searchParams.set("phase", phase.toString());
      history.replace({
        pathname: location.pathname,
        search: searchParams.toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return phase;
};
