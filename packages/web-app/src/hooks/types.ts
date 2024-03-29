// TODO move somewhere else

import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import {
  Channel as StoreChannel,
  Message as StoreMessage,
  Phase,
} from "@diplicity/common";

export type Message = StoreMessage & {
  phase: Phase;
  undelivered: boolean;
  color: string;
  variant: string;
  selfish: boolean;
  nationAbbreviation: string;
  link: string | undefined;
};

export interface Channel extends StoreChannel {
  title: string;
  nations: {
    name: string;
    abbreviation: string;
    color: string;
    link: string | undefined;
  }[];
  member?: {
    Nation: string;
  };
  id: string;
}

type SimplifiedQueryResult = {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error?: ApiError;
};

export type CombinedQueryState = SimplifiedQueryResult;

export type CombinedQuery = {
  [key: string]: Partial<SimplifiedQueryResult>;
};

export type ApiError = FetchBaseQueryError | SerializedError | undefined;

export type DiplicityError = ApiError & {
  status: number;
  data: any;
}
export interface ApiResponse {
  combinedQueryState: CombinedQueryState;
}