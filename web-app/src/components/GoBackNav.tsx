import React from "react";

import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import { useHistory } from "react-router";
import { RouteConfig } from "../pages/RouteConfig";
import { GoBackIcon } from "../icons";

const TITLE = "Go back";

interface GoBackNavProps {
  title: string;
  href: string;
  children: React.ReactNode;
}

const GoBackNav = ({
  children,
  title,
  href,
}: GoBackNavProps): React.ReactElement => {
  const history = useHistory();

  const onClick = () => history.push(href);

  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClick}
            aria-label="close"
            title={TITLE}
          >
            <GoBackIcon />
          </IconButton>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
};

GoBackNav.defaultProps = {
  href: RouteConfig.Home,
};

export default GoBackNav;
