import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { IAuthService } from "../../services/auth";
import { Headers } from "../types";

export const serviceUrl = "https://diplicity-engine.appspot.com/";

const baseQuery = fetchBaseQuery({
  baseUrl: serviceUrl,
  prepareHeaders: (headers) => {
    headers.set(Headers.XDiplicityAPILevel, "8");
    headers.set(Headers.XDiplicityClientName, "dipact@"); // TODO
    headers.set(Headers.Accept, "application/json");
    headers.set(Headers.ContentType, "application/json");
    return headers;
  },
  mode: "cors",
});

const createAuthApi = (authService: IAuthService) =>
  createApi({
    reducerPath: "auth",
    baseQuery,
    endpoints: (builder) => ({
      login: builder.query({
        queryFn: async (_, __, ___, originalBaseQuery) => {
          const idToken = await authService.getIdToken();
          const encodedIdToken = encodeURIComponent(idToken);
          const encodedState = encodeURIComponent("https://android-diplicity");
          const url = `${serviceUrl}Auth/OAuth2Callback?code=${encodedIdToken}&approve-redirect=true&state=${encodedState}`;
          return await originalBaseQuery(url);
        },
      }),
    }),
  });

export { createAuthApi };
