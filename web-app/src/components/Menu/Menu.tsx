import React from "react";
import {
  AppBar,
  ClickAwayListener,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
} from "@material-ui/core";
import { GitHub, BugReport, MonetizationOn } from "@material-ui/icons";
import { Link } from "react-router-dom";

import { useState } from "react";
import { MenuRounded } from "@material-ui/icons";
import useRegisterPageView from "../../hooks/useRegisterPageView";
import UserMenu from "../UserMenu";
import useStyles from "./Menu.styles";

const links = {
  chat: "https://discord.gg/bu3JxYc",
  forum: "https://groups.google.com/g/diplicity-talk",
  help: "https://sites.google.com/corp/view/diplicity",
  github: "https://github.com/zond/dipact",
};

interface MenuListItemProps {
  to: string;
  label: string;
}
const MenuListItem: React.FC<MenuListItemProps> = ({ to, label }) => {
  const classes = useStyles();
  return (
    <Link to={to}>
      <ListItem button>
        <ListItemText primary={label} className={classes.link} />
      </ListItem>
    </Link>
  );
};

interface MenuListHeaderProps {
  label: string;
}
const MenuListHeader: React.FC<MenuListHeaderProps> = ({ label }) => {
  const classes = useStyles();
  return (
    <ListItem className={classes.header}>
      <ListItemText primary={label} />
    </ListItem>
  );
};

const Menu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  useRegisterPageView("MainMenu"); // TODO this isn't really a page. Move somewhere else

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => setOpen(!open)}
            color="secondary"
          >
            <MenuRounded />
          </IconButton>
          <UserMenu logout={() => console.log("Logout")} />
        </Toolbar>
      </AppBar>
      <Drawer open={open}>
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <div onClick={() => setOpen(false)} className={classes.bufferDiv}>
            <List component="nav">
              <MenuListItem to="/about" label="About" />
              <Divider />
              <MenuListHeader label="My Diplicity" />
              <MenuListItem to="/my-games" label="My games" />
              <MenuListItem to="/settings" label="Settings" />
              <Divider />
              <MenuListHeader label="Public games" />
              <MenuListItem to="/open-games" label="Open games" />
              <MenuListItem to="/open-games" label="Open games" />
              <MenuListItem to="/started-games" label="Started games" />
              <MenuListItem to="/finished-games" label="Finished games" />
              <Divider />
              <MenuListHeader label="Game mastered games" />
              <MenuListItem
                to="/mastered-staging-games"
                label="Staging games"
              />
              <MenuListItem
                to="/mastered-started-games"
                label="Started games"
              />
              <MenuListItem
                to="/mastered-finished-games"
                label="Finished games"
              />
              <Divider />
              <MenuListHeader label="Community" />
              <MenuListItem to={links.chat} label="Chat" />
              <MenuListItem to={links.forum} label="Forum" />
              <MenuListItem to={links.help} label="Help" />
              <Divider />
            </List>
            <div className={classes.iconLinks}>
              <a href={links.github} target="_blank" rel="noreferrer">
                <div id="github">
                  <GitHub />
                </div>
              </a>
              <a href={links.github} target="_blank" rel="noreferrer">
                <BugReport />
              </a>
              <a href={links.github} target="_blank" rel="noreferrer">
                <MonetizationOn />
              </a>
            </div>
          </div>
        </ClickAwayListener>
      </Drawer>
    </>
  );
};

export default Menu;
