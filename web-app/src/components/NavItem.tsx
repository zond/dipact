import React from "react";
import { alpha, IconButton, Theme } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from "react-router-dom";


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
  edge?: "end" | "start";
  active: boolean;
  external?: true;
  text?: boolean
}

const NavItem = ({
  children,
  href,
  label,
  edge,
  active,
  external,
}: NavItemProps): React.ReactElement => {
  const classes = useNavStyles({ active });
  const history = useHistory();
  const goToLink = () => (!external) && history.push(href);
  return (
    <a
      className={classes.root}
      href={href}
      onClick={(e) => !external && e.preventDefault()}
      title={label}
      target="_blank"
      rel="noreferrer"
    >
      <IconButton edge={edge} aria-label={label} onClick={goToLink} size="large">
        {children}
      </IconButton>
    </a>
  );
};

NavItem.defaultProps = {
  active: false,
};

export default NavItem;
