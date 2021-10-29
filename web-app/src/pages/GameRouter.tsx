import React from "react";
import { Switch, Route } from "react-router-dom";
import ChatMenu from "./ChatMenu";
import ChatChannel from "./ChatChannel";
import { RouteConfig } from "./RouteConfig";
import GameNavBar from "../components/GameNavBar";
import Orders from "./Orders";
import Game from "./Game";

export const Routes = (): React.ReactElement => {
  return (
    <Switch>
      <Route exact path={RouteConfig.Game}>
        <Game />
      </Route>
      <Route exact path={RouteConfig.GameChat}>
        <ChatMenu />
      </Route>
      <Route exact path={RouteConfig.GameChatChannel}>
        <ChatChannel />
      </Route>
      <Route exact path={RouteConfig.Orders}>
        <Orders />
      </Route>
    </Switch>
  );
};

const GameRouter = (): React.ReactElement => {
  return (
    <GameNavBar>
      <Routes />
    </GameNavBar>
  );
};

export default GameRouter;
