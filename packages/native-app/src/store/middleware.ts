import { Middleware } from "@reduxjs/toolkit";

export const debugMiddleware: Middleware<{}, any> =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    // console.log(getState());
    // console.log(action);
    return next(action);
  };

const middleware = [
  debugMiddleware,
];
export default middleware;
