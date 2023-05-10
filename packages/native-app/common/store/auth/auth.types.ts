import { createAuthApi } from "./auth";

export type AuthApiContextProviderProps = {
  authApi: ReturnType<typeof createAuthApi>;
  children: React.ReactNode;
};
