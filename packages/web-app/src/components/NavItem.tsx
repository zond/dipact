import React from "react";
import { alpha, IconButton, Theme, makeStyles } from "@material-ui/core";
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

type IconButtonProps = Parameters<typeof IconButton>[0];

interface NavItemProps extends IconButtonProps {
  children: React.ReactNode;
  href: string;
  label: string;
  active: boolean;
  external?: true;
  text?: boolean;
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
  const goToLink = () => !external && history.push(href);
  return (
    <a
      className={classes.root}
      href={href}
      onClick={(e) => !external && e.preventDefault()}
      title={label}
      target="_blank"
      rel="noreferrer"
    >
      <IconButton edge={edge} aria-label={label} onClick={goToLink}>
        {children}
      </IconButton>
    </a>
  );
};

NavItem.defaultProps = {
  active: false,
};

export default NavItem;
