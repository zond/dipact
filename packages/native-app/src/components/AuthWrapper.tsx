import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { authActions, selectors } from "@diplicity/common";
import { useAppSelector } from "../hooks/useAppSelector";
import { Linking } from "react-native";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const key = "token";

const getTokenFromUrl = (url: string): string | null => {
  const reg = /[?&]token=([^&#]*)/g;
  const match = reg.exec(url);
  const token = match ? match[1] : null;
  return token;
};

const AuthWrapper = ({ children }: AuthWrapperProps): React.ReactElement => {
  const dispatch = useDispatch();
  const token = useAppSelector(selectors.selectToken);
  Linking.addEventListener("url", ({ url }) => {
    const qsToken = getTokenFromUrl(url);
    if (qsToken && !token) dispatch(authActions.login(qsToken));
  });
  return <>{children}</>;
};

export default AuthWrapper;
