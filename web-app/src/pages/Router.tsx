import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import GameRouter from "./GameRouter";
import Login from "./Login";
import { RouteConfig } from "./RouteConfig";

import { useSelectIsLoggedIn } from "../hooks/selectors";

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
      {/* <Route exact path="/">
        		<LegacyApp />
			</Route> */}
      {/* <Route exact path={RouteConfig.About}>
				<About />
			</Route>
			<Route exact path={RouteConfig.Game}>
				<Game />
			</Route>
			<Route exact path={RouteConfig.GameTab}>
				<Game />
			</Route> */}
      <Route path={RouteConfig.Game}>
        <GameRouter />
      </Route>
      {/* <Route exact path={RouteConfig.GameLaboratoryMode}>
				<Game laboratoryMode />
			</Route> */}
      {/* <Redirect to="/" /> */}
    </Switch>
  );
};

const Router = (): React.ReactElement => {
  const isLoggedIn = useSelectIsLoggedIn();

  return (
    <BrowserRouter>
      {isLoggedIn ? <Routes /> : <LoggedOutRoutes />}
    </BrowserRouter>
  );
};

export default Router;
