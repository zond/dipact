import React from "react";
import { DiplicityApiContextProviderProps } from "./diplicity.types";
import { createContext } from "react";
import { createDiplicityApi } from "./diplicity";

const DiplicityApiContext = createContext<
  ReturnType<typeof createDiplicityApi>
>({} as ReturnType<typeof createDiplicityApi>);

const DiplicityApiProvider = (props: DiplicityApiContextProviderProps) => {
  return (
    <DiplicityApiContext.Provider value={props.diplicityApi}>
      {props.children}
    </DiplicityApiContext.Provider>
  );
};

export { DiplicityApiContext, DiplicityApiProvider };
