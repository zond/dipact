import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import { authActions, selectors } from "@diplicity/common";
import { useAppSelector } from "../hooks/useAppSelector";
import { storeToken } from "../helpers";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const key = "token";

const AuthWrapper = ({ children }: AuthWrapperProps): React.ReactElement => {
  /* Look for token in qs params and store if present */
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const token = useAppSelector(selectors.selectToken);

  useEffect(() => {
    const onFoundToken = (token: string) => {
      dispatch(authActions.login(token));
      storeToken(token); // TODO remove eventually
    };
    if (token) return;
    const searchParams = new URLSearchParams(location.search);
    const qsToken = searchParams.get(key);
    if (qsToken) {
      searchParams.delete(key);
      history.replace({
        search: searchParams.toString(),
      });
      onFoundToken(qsToken);
    }
    const localStorageToken = localStorage.getItem(key);
    if (localStorageToken) {
      onFoundToken(localStorageToken);
    }
  }, [dispatch, history, location.search, token]);
  return <>{children}</>;
};

export default AuthWrapper;
