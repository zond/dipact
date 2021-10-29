import React from "react";
import { AppBar, Container, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

import { ChatIcon, GoBackIcon, MapIcon, OrdersOpenIcon } from "../icons";
import {
  generatePath,
  matchPath,
  useLocation,
  useParams,
} from "react-router-dom";
import { RouteConfig } from "../pages/RouteConfig";
import NavItem from "./NavItem";

interface GameNavBarProps {
  children: React.ReactNode;
}

interface GameUrlParams {
  gameId: string;
}

enum Tabs {
  Chat = "chat",
  Orders = "orders",
  Game = "game",
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    "& > div": {
      display: "flex",
      gap: theme.spacing(1),
    },
  },
}));

const getActive = (path: string): string | null => {
  const exact = true;
  if (
    matchPath(path, { path: RouteConfig.GameChat, exact }) ||
    matchPath(path, { path: RouteConfig.GameChatChannel, exact })
  )
    return Tabs.Chat;
  if (matchPath(path, { path: RouteConfig.Game, exact })) return Tabs.Game;
  if (matchPath(path, { path: RouteConfig.Orders, exact })) return "orders";
  return Tabs.Orders;
};

// TODO test
const GameNavBar = ({ children }: GameNavBarProps): React.ReactElement => {
  const classes = useStyles();
  const params = useParams<GameUrlParams>();
  const location = useLocation();
  const activeChannel = getActive(location.pathname);
  const { gameId } = params;

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar variant="dense">
          <Container className={classes.container}>
            <div>
              <NavItem
                href={RouteConfig.Home}
                edge="end"
                label="home"
                active={false}
              >
                <GoBackIcon />
              </NavItem>
            </div>
            <div>
              <NavItem
                href={generatePath(RouteConfig.Game, { gameId })}
                edge="end"
                label={Tabs.Game}
                active={activeChannel === Tabs.Game}
              >
                <MapIcon />
              </NavItem>
              <NavItem
                href={generatePath(RouteConfig.GameChat, { gameId })}
                edge="end"
                label={Tabs.Chat}
                active={activeChannel === Tabs.Chat}
              >
                <ChatIcon />
              </NavItem>
              <NavItem
                href={generatePath(RouteConfig.Orders, { gameId })}
                edge="end"
                label={Tabs.Orders}
                active={activeChannel === Tabs.Orders}
              >
                <OrdersOpenIcon />
              </NavItem>
            </div>
          </Container>
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
};

export default GameNavBar;
