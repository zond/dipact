import { Query } from "..";

type Queries = { [key: string]: Query<any> };

export const combineQueries = <TObj extends Queries>(queries: TObj) => ({
  isLoading: Object.values(queries).some((q) => q.isLoading),
  isError: Object.values(queries).some((q) => q.isError),
  isSuccess: Object.values(queries).every((q) => q.isSuccess),
  data: Object.entries(queries).reduce((acc, curr) => {
    const [key, q] = curr as [keyof TObj, TObj[keyof TObj]];
    if (q.isSuccess && q.data) {
      acc[key] = q.data;
    }
    return acc;
  }, {} as { [K in keyof TObj]: TObj[K]["data"] }),
});
