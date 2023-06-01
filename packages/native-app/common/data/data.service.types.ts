/**
 * Data types representing the data models returned by the API.
 */
// Ignore
export interface ApiResponse<TObj> {
  Properties: TObj;
  Name?: string;
  Type?: string;
  Desc?: string[][];
  Links?: Link[] | null;
}

type Edge = {
  Flags: {
    [key: string]: boolean;
  };
};

type Link = {
  Rel: string;
  URL: string;
  Method: string;
  JSONschema: string; // TODO
};
