// TODO move somewhere else
import { ApiError, DiplicityError } from "./types";

export const mergeErrors = (
  ...errorsOrUndefined: (ApiError | undefined)[]
): DiplicityError => {
  const errors: DiplicityError[] = [];
  errorsOrUndefined.forEach((error) => {
    if (error) errors.push(error as DiplicityError);
  });
  return errors.reduce(
    (mergedErrors, e) => {
      const error = e as ApiError & { status: number; data: any };
      const newError = {
        status: error?.status || mergedErrors.status,
        data: error?.data || mergedErrors.data,
      };
      return newError as ApiError & { status: number; data: any };
    },
    { status: 0, data: {} } as DiplicityError
  );
};
