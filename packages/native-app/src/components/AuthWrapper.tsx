import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

import { authActions, selectors } from "../../common/store";
import { useAppSelector } from "../hooks/useAppSelector";
import { Linking } from "react-native";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const getTokenFromUrl = (url: string): string | null => {
  const decodedUrl = decodeURIComponent(url);
  const reg = /[?&]token=([^&#]*)/g;
  const match = reg.exec(decodedUrl);
  const token = match ? match[1] : null;
  return token;
};

const AuthWrapper = ({ children }: AuthWrapperProps): React.ReactElement => {
  const dispatch = useDispatch();
  const token = useAppSelector(selectors.selectToken);

  const callback = useCallback(
    ({ url }: { url: string }) => {
      const qsToken = getTokenFromUrl(url);
      if (qsToken && !token) {
        dispatch(authActions.login(qsToken));
      }
    },
    [dispatch, token]
  );
  useEffect(() => {
    Linking.removeAllListeners("url");
    Linking.addEventListener("url", callback);
  }, [callback]);
  return <>{children}</>;
};

export default AuthWrapper;
