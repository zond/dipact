import React from "react";
import { AuthApiContextProviderProps } from "./auth.types";
import { createContext } from "react";
import { createAuthApi } from "./auth";

const AuthApiContext = createContext<ReturnType<typeof createAuthApi>>(
  {} as ReturnType<typeof createAuthApi>
);

const AuthApiProvider = (props: AuthApiContextProviderProps) => {
  return (
    <AuthApiContext.Provider value={props.authApi}>
      {props.children}
    </AuthApiContext.Provider>
  );
};

export { AuthApiContext, AuthApiProvider };
