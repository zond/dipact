import React from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { GoBackIcon } from "../icons";

interface NavBarProps extends RouteComponentProps {
	title: string;
}

// TODO test
const NavBar = ({ history, title }: NavBarProps): JSX.Element => {
	const close = (): void => history.push("/");
	return (
		<>
			<AppBar>
				<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						onClick={close}
						aria-label="close"
					>
						<GoBackIcon />
					</IconButton>
					<Typography variant="h6">Settings</Typography>
				</Toolbar>
			</AppBar>

			<Toolbar />
		</>
	);
};

export default withRouter(NavBar);
