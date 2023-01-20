import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

import { authActions, selectors } from "@diplicity/common";
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

const devToken: string | undefined =
  "9HSUAzK8OUCnVp-nj9QKT9kN37tnhWEoEHpLGRUnO-leAZ1e4IxAOjm2ZTJKuI33VBZy743tFYJIMHcPNEIzT5YMPM8J6TRrd5bOhH43z-U75GqllJUq7hctIYbSs4H4s_YcMPZipDDHAQtrhH0Bh8QC9urSswwMF3Hmp4PtbHT7dlkZXGzLeetFWT7aEnw5zMi1l5yenO4Ug-X-9rFWd3WknwD6KNxymKsmsLMPkmatZ6B1p3YV6X7UHjeP_7PEp8Gs3RHpLwKG4xbHXYfFETVpS3u0PitQNh43H6FqItTy4ZLTMco8ybRy1VDnjx3nLi1JDaA8fo9jp8t9cGC37Haq_PZP3XZSyzFBrNfsmAKYx4V6PdAgBB1bpdFxMx0p7_Y8J9G7E12bfQCWwwaSM_MJ5DMW-BVldnP3GFnal-Y3RRQDxs1p2iaCdFV-helnqedfWiy5Ck4F8ZSTOge4BXk5mc8fYHTIXfYE17Crgc6Ceu3Mzr-gtbxsvtefR9o=";

const AuthWrapper = ({ children }: AuthWrapperProps): React.ReactElement => {
  const dispatch = useDispatch();
  const token = useAppSelector(selectors.selectToken);

  if (devToken) {
    dispatch(authActions.login(devToken));
  }

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
