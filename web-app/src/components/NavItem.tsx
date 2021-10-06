import React from "react";
import { alpha, IconButton, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

import { useHistory } from "react-router-dom";
import { RouteConfig } from "../pages/RouteConfig";

interface StyleProps {
  active: boolean;
}

const useNavStyles = makeStyles<Theme, StyleProps>((theme) => ({
  root: {
    "& > button": {
      color: ({ active }) =>
        active
          ? theme.palette.text.primary
          : alpha(theme.palette.text.primary, 0.5),
    },
  },
}));

interface NavItemProps {
  children: React.ReactNode;
  href: string;
  label: string;
  edge: "end" | "start";
  active: boolean;
}

const NavItem = ({
  children,
  href,
  label,
  edge,
  active,
}: NavItemProps): React.ReactElement => {
  const classes = useNavStyles({ active });
  const history = useHistory();
  const goToLink = () => history.push(href);
  return (
    <a
      className={classes.root}
      href={RouteConfig.Home}
      onClick={(e) => e.preventDefault()}
      title={label}
    >
      <IconButton edge={edge} aria-label={label} onClick={goToLink}>
        {children}
      </IconButton>
    </a>
  );
};

NavItem.defaultProps = {
  active: true,
};

export default NavItem;
