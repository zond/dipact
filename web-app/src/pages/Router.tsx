import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { ChatMenu } from "../components/Chat";
import ChatChannel from "../components/Chat/ChatChannel";
import Game from "../components/Game";
import LegacyApp from "../LegacyApp";
import About from "./About";
import { RouteConfig } from "./RouteConfig";

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
			<Route exact path={RouteConfig.GameChat}>
				<ChatMenu />
			</Route>
			<Route exact path={RouteConfig.GameChatChannel}>
				<ChatChannel />
			</Route>
			{/* <Route exact path={RouteConfig.GameLaboratoryMode}>
				<Game laboratoryMode />
			</Route> */}
			{/* <Redirect to="/" /> */}
		</Switch>
	);
};

const Router = (): React.ReactElement => {
	return (
		<BrowserRouter>
			<Routes />
		</BrowserRouter>
	);
};

export default Router;
