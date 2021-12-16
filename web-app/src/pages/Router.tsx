import React from "react";
import { Router as ReactRouter } from "react-router";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { MemoryHistory } from "history";

import GameRouter from "./GameRouter";
import Login from "./Login";
import { RouteConfig } from "./RouteConfig";
import { useSelectIsLoggedIn } from "../hooks/selectors";
import MainMenu from "../components/MainMenu";
import Donate from "./Donate";
import GameList from "./GameList";
import NationPreferencesDialog from "../components/NationPreferencesDialog";
import About from "./About";

// TODO test
export const LoggedOutRoutes = (): React.ReactElement => {
  return (
    <Switch>
      <Route path={RouteConfig.Login}>
        <Login />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};

// Separated into two components to make testing routes easier
export const Routes = (): React.ReactElement => {
  return (
    <Switch>
      <Route exact path="/">
        <MainMenu>
          <div></div>
        </MainMenu>
			</Route>
      <Route exact path={RouteConfig.Donate}>
        <Donate />
			</Route>
      <Route exact path={RouteConfig.About}>
        <About />
			</Route>
      <Route exact path={RouteConfig.GameList}>
        <GameList />
      </Route>
      <Route path={RouteConfig.Game}>
        <GameRouter />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
}

const Router = (): React.ReactElement => {
  const isLoggedIn = useSelectIsLoggedIn();

  return (
    <BrowserRouter>
      {isLoggedIn ? <Routes /> : <LoggedOutRoutes />}
      <NationPreferencesDialog />
    </BrowserRouter>
  );
};

/**
 * Decorator used to provide router context during tests.
 */
export const routerDecorator = (history: MemoryHistory<unknown>, path?: string) => {
  return (Component: () => JSX.Element) => {
    history.push(path || "/");
    return () => (
      <ReactRouter history={history}>
        <Component />
      </ReactRouter>
    );
  };
};

export default Router;
