import {
  createApi,
  BaseQueryFn,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { RootState } from "./store";
import data from "./data.json";

type Link = {
  Rel: string;
  URL: string;
  Method: string;
  JSONschema: string; // TODO
};

type Unit = {
  Type: string;
  Nation: string;
};

type Sub = {
  Name: string;
  Edges: {};
};

type Node = {
  Name: string;
  Subs: { [key: string]: Sub };
  SC: string;
};

type Graph = {
  Nodes: { [key: string]: Node };
};

type Start = {
  Year: number;
  Season: string;
  Type: string;
  SCs: { [key: string]: string };
  Units: { [key: string]: Unit };
  Map: string;
  Graph: Graph;
};

type Variant = {
  Name: string;
  Nations: string[];
  PhaseTypes: string[];
  Season: string[];
  UnitTypes: string[];
  SvgVersion: string;
  ProvinceLongNames: { [key: string]: string };
  NationColors: null | { [key: string]: string };
  CreatedBy: string;
  Version: string;
  Description: string;
  Rules: string;
  OrderTypes: string[];
};

type VariantResponse = {
  Name: string;
  Properties: Variant[];
  Type: string;
  Desc: string[][];
  Links: Link[];
};

const hrefURL = new URL(location.href);
const serviceURL =
  localStorage.getItem("serverURL") || "https://diplicity-engine.appspot.com/";

// type VariantResponse = {
//   data:
// }

// Define a service using a base URL and expected endpoints
export const diplicityService = createApi({
  reducerPath: "diplicityService",
  baseQuery: fetchBaseQuery({
    baseUrl: serviceURL,
    prepareHeaders: (headers, { getState }) => {
      // const token = (getState() as RootState).auth.token;
      // If we have a token set in state, let's assume that we should be passing it.
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`);
      // }
      headers.set("X-Diplicity-API-Level", "8");
      headers.set("X-Diplicity-Client-Name", "dipact@" + hrefURL.host);
      headers.set("Accept", "application/json");
      return headers;
    },
    mode: "cors",
  }),
  endpoints: (builder) => ({
    getVariants: builder.query<Variant[], undefined>({
      query: () => "/Variants",
      // transformResponse: (rawResult) => {
      //   //                                                        ^
      //   // The optional `meta` property is available based on the type for the `baseQuery` used

      //   // The return value for `transformResponse` must match `ResultType`
      //   return rawResult.result.post
      // },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetVariantsQuery } = diplicityService;
