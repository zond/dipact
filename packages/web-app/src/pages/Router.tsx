import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { LegacyApp } from "../App";
import AuthWrapper from "../components/AuthWrapper";

import CreateGame from "./CreateGame";
import { history } from "../store";
import { RouteConfig } from "./RouteConfig";
import MyGames from "./MyGames";

const Router = (): React.ReactElement => {
  return (
    <ConnectedRouter history={history}>
      <AuthWrapper>
        <Switch>
          <Route exact path={RouteConfig.Home}>
            <LegacyApp />
          </Route>
          <Route exact path={RouteConfig.CreateGame}>
            <CreateGame />
          </Route>
          <Route exact path={RouteConfig.MyGames}>
            <MyGames />
          </Route>
          <Redirect to="/" />
        </Switch>
      </AuthWrapper>
    </ConnectedRouter>
  );
};

export default Router;
