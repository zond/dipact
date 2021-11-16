import { createMemoryHistory } from "history";
import { Router } from "react-router";

import {
  IUseOrders,
  useDIContext as useOrdersDIContext,
} from "../hooks/useOrders";
import {
  IUsePhaseSelector,
  useDIContext as usePhaseSelectorContext,
} from "../hooks/usePhaseSelector";

export const routerDecorator = (path?: string) => {
  return (Component: () => JSX.Element) => {
    const history = createMemoryHistory();
    history.push(path || "/");
    return (
      <Router history={history}>
        <Component />
      </Router>
    );
  };
};

export const ordersDecorator = (values: IUseOrders) => {
  return (Component: () => JSX.Element) => (
    <useOrdersDIContext.Provider value={() => values}>
      <Component />
    </useOrdersDIContext.Provider>
  );
};

export const phaseSelectorDecorator = (values: IUsePhaseSelector) => {
  return (Component: () => JSX.Element) => (
    <usePhaseSelectorContext.Provider value={() => values}>
      <Component />
    </usePhaseSelectorContext.Provider>
  );
};
