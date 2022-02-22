import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import Globals from "../Globals";

import { authActions } from "@diplicity/common";

interface TokenHandlerProps {
  children: React.ReactNode;
}

// TODO test
const TokenHandler = ({ children }: TokenHandlerProps): React.ReactElement => {
  /* Look for token in qs params and store if present */
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    if (token) {
      searchParams.delete("token");
      history.replace({
        search: searchParams.toString(),
      });
    }
    if (token) {
      dispatch(authActions.login(token));
      Globals.serverRequest.headers.set("Authorization", "bearer " + token);
    }
  }, [dispatch, history, location.search]);
  return <>{children}</>;
};

export default TokenHandler;
