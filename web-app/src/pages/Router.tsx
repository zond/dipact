import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import MainMenu from "../components/MainMenu";
import Settings from "./Settings";

const Router = (): React.ReactElement => {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/">
					<MainMenu />
				</Route>
				<Route exact path="/settings">
					<Settings />
				</Route>
				<Redirect to="/" />
			</Switch>
		</BrowserRouter>
	);
};

export default Router;
