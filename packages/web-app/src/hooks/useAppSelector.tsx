/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "@diplicity/common";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;