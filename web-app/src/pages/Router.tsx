import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Game from "../components/Game";
import MainMenu from "../components/MainMenu";
import About from "./About";

type RouteProps = {
	urls: { [key: string]: string };
};

export const RouteConfig = {
	About: '/about',
	GameTab: '/game/:gameId/:tab',
	Game: '/game/:gameId',
	GameChatChannel: '/game/:gameId/channel/:channelId/messages',
	GameLaboratoryMode: '/game/:gameId/lab/:labOptions',
}

// Separated into two components to make testing routes easier
export const Routes = (props: RouteProps): React.ReactElement => {
	return (
		<Switch>
			<Route exact path="/">
				<MainMenu urls={props.urls} />
			</Route>
			<Route exact path={RouteConfig.About}>
				<About />
			</Route>
			<Route exact path={RouteConfig.Game}>
				<Game />
			</Route>
			<Route exact path={RouteConfig.GameTab}>
				<Game />
			</Route>
			<Route exact path={RouteConfig.GameChatChannel}>
				<Game chatOpen />
			</Route>
			<Route exact path={RouteConfig.GameLaboratoryMode}>
				<Game laboratoryMode />
			</Route>
			<Redirect to="/" />
		</Switch>
	);
};

const Router = (props: RouteProps): React.ReactElement => {
	return (
		<BrowserRouter>
			<Routes urls={props.urls} />
		</BrowserRouter>
	);
};

export default Router;
