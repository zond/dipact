import { createDiplicityApi } from "./diplicity";
import { IAuthService, ITelemetryService } from "../../services";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/dist/query";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

export enum TagType {
  Game = "Game",
  ListGames = "ListGames",
  Messages = "Messages",
  PhaseState = "PhaseState",
  Token = "Token",
  UserConfig = "UserConfig",
}

export interface ListGameFilters {
  my: boolean;
  status: string;
  mastered: boolean;
}

export type CreateDiplicityApiOptions = {
  telemetryService: ITelemetryService;
  authService: IAuthService;
};

export type DiplicityApiContextProviderProps = {
  diplicityApi: ReturnType<typeof createDiplicityApi>;
  children: React.ReactNode;
};

export type DiplicityApiBuilder = EndpointBuilder<
  BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    {},
    FetchBaseQueryMeta
  >,
  TagType,
  "diplicity"
>;
