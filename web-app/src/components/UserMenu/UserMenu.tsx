import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";

import { Menu, MenuItem, IconButton, Avatar } from "@material-ui/core";
import { useUser } from "../../hooks/selectors";
import useStyles from "./UserMenu.styles";

interface UserMenuProps extends RouteComponentProps {
  logout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ logout, history }) => {
  const user = useUser();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-controls="customized-menu"
        aria-haspopup="true"
        title="Menu"
        color="secondary"
        onClick={handleClick}
      >
        <Avatar alt="user icon" src={user.Picture} className={classes.avatar} />
      </IconButton>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        <MenuItem key="email" style={{ fontWeight: "bold" }}>
          {user.Email}
        </MenuItem>
        <MenuItem title="stats">Player stats</MenuItem>
        <MenuItem title="logout" onClick={logout}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default withRouter(UserMenu);
