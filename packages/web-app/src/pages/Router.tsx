import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { LegacyApp } from "../App";

import CreateGame from "./CreateGame";

export const RouteConfig = {
  CreateGame: "/create-game",
  Home: "/",
};

const Router = (): React.ReactElement => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={RouteConfig.Home}>
          <LegacyApp />
        </Route>
        <Route exact path={RouteConfig.CreateGame}>
          <CreateGame />
        </Route>
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
