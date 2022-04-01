export const getLoginUrl = (): string => {
  const redirectUrl = "https://www.diplicitynative.com/auth";
  const tokenDuration = 60 * 60 * 24;
  return`https://diplicity-engine.appspot.com/Auth/Login?redirect-to=${encodeURI(
    redirectUrl
  )}&token-duration=${tokenDuration}`;
};
