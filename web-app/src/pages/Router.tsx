import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import MainMenu from "../components/MainMenu";
import About from "./About";

type RouteProps = {
	urls: { [key: string]: string };
};

// Separated into two components to make testing routes easier
export const Routes = (props: RouteProps): React.ReactElement => {
	return (
		<Switch>
			<Route exact path="/">
				<MainMenu urls={props.urls} />
			</Route>
			<Route exact path="/about">
				<About />
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