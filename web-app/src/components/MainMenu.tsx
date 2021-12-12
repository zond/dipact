import {
  AppBar,
  Avatar,
  ClickAwayListener,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from "react";
import { useHistory } from "react-router";

import useRegisterPageView from "../hooks/useRegisterPageview";
import useMainMenu, { useDIContext, IUseMainMenu } from "../hooks/useMainMenu";
import { MenuIcon, GitHubIcon, BugReportIcon, DonateIcon } from "../icons";
import { RouteConfig } from "../pages/RouteConfig";
import useSearchParams from "../hooks/useSearchParams";
import NavItem from "./NavItem";

const DRAWER_TITLE = "Main menu drawer";
const OPEN_USER_MENU_BUTTON_TITLE = "Open user menu";
const OPEN_DRAWER_BUTTON_TITLE = "Open drawer";
const USER_AVATAR_ALT_TEXT = "Your avatar";
const PLAYER_STATS_MENU_ITEM = "Player stats";
const LOGOUT_MENU_ITEM = "Logout";
const ABOUT_MENU_ITEM = "About";
const MY_DIPLICITY_MENU_ITEM = "My Diplicity";
const SETTINGS_MENU_ITEM = "Settings";
const COMMUNITY_MENU_ITEM = "Community";
const CHAT_MENU_ITEM = "Chat";
const FORUM_MENU_ITEM = "Forum";
const FAQ_MENU_ITEM = "FAQ";
const GITHUB_BUTTON_LABEL = "GitHub repo for this project";
const DONATE_BUTTON_LABEL = "Donate to this project";
const ERROR_BUTTON_LABEL = "Report a bug";

const CHAT_URL = "https://discord.gg/bu3JxYc";
const FORUM_URL = "https://groups.google.com/g/diplicity-talk";
const FAQ_URL =
  "https://diplicity.notion.site/diplicity/Diplicity-FAQ-7b4e0a119eb54c69b80b411f14d43bb9";
const DIPACT_GITHUB_URL = "https://github.com/zond/dipact";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    justifyContent: "space-between",
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  email: {
    fontWeight: "bold",
  },
  drawer: {
    width: "220px", // TODO remove hard coding
  },
  menuItemSectionHeader: {
    height: theme.spacing(5),
    "& > div": {
      color: theme.palette.grey[500],
      font: "500 14px / 48px Cabin, Roboto, sans-serif", // TODO remove hard coding
    },
  },
  icons: {
    color: theme.palette.text.primary,
    display: "Flex",
    justifyContent: "space-around",
  },
}));

interface MainMenuProps {
  children: React.ReactNode;
}

const MainMenu = ({ children }: MainMenuProps) => {
  useRegisterPageView("MainMenu");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerOpenedAt, setDrawerOpenedAt] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const history = useHistory();
  const classes = useStyles();
  const { setParam } = useSearchParams();
  const { logout, user } = useMainMenu();

  const openDrawer = () => {
    setDrawerOpenedAt(new Date().getTime());
    setDrawerOpen(true);
  };
  const closeDrawer = () => setDrawerOpen(false);

  const onClickAvatar = (e: React.MouseEvent<HTMLButtonElement>) =>
    setMenuAnchorEl(e.currentTarget);
  const onClickPlayerStats = () => setParam("player-stats", user.Id as string);
  const onClickAbout = () => history.push(RouteConfig.About);
  const onClickSettings = () => history.push(RouteConfig.Settings);
  const onClickErrorLog = () => setParam("error-log", "1");

  const onClickChat = () => window.open(CHAT_URL, "_blank");
  const onClickForum = () => window.open(FORUM_URL, "_blank");
  const onClickFAQ = () => window.open(FAQ_URL, "_blank");

  return <>
    <AppBar position="fixed">
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          onClick={openDrawer}
          color="secondary"
          title={OPEN_DRAWER_BUTTON_TITLE}
          size="large">
          <MenuIcon />
        </IconButton>
        <IconButton
          edge="end"
          onClick={onClickAvatar}
          color="secondary"
          title={OPEN_USER_MENU_BUTTON_TITLE}
          size="large">
          <Avatar
            alt={USER_AVATAR_ALT_TEXT}
            src={user.Picture}
            className={classes.avatar}
          />
        </IconButton>
        <Menu
          anchorEl={menuAnchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          onClose={() => setMenuAnchorEl(null)}
          open={!!menuAnchorEl}
        >
          <MenuItem key="email" className={classes.email} disabled>
            {user.Email}
          </MenuItem>
          <MenuItem key="stats" onClick={onClickPlayerStats}>
            {PLAYER_STATS_MENU_ITEM}
          </MenuItem>

          <MenuItem key="logout" onClick={logout}>
            {LOGOUT_MENU_ITEM}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
    <Drawer open={drawerOpen}>
      <ClickAwayListener
        onClickAway={() => {
          if (drawerOpenedAt && new Date().getTime() > drawerOpenedAt + 100) {
            closeDrawer();
          }
        }}
      >
        <div
          onClick={closeDrawer}
          className={classes.drawer}
          title={DRAWER_TITLE}
        >
          <List component="nav">
            <ListItem className={classes.menuItemSectionHeader}>
              <ListItemText
                primary={MY_DIPLICITY_MENU_ITEM}
                disableTypography
              />
            </ListItem>

            <ListItem button onClick={onClickSettings}>
              <ListItemText primary={SETTINGS_MENU_ITEM} />
            </ListItem>

            <Divider />

            <ListItem className={classes.menuItemSectionHeader}>
              <ListItemText primary={COMMUNITY_MENU_ITEM} disableTypography />
            </ListItem>

            <ListItem button onClick={onClickChat}>
              <ListItemText primary={CHAT_MENU_ITEM} />
            </ListItem>

            <ListItem button onClick={onClickForum}>
              <ListItemText primary={FORUM_MENU_ITEM} />
            </ListItem>

            <Divider />

            <ListItem button onClick={onClickFAQ}>
              <ListItemText primary={FAQ_MENU_ITEM} />
            </ListItem>

            <ListItem button onClick={onClickAbout}>
              <ListItemText primary={ABOUT_MENU_ITEM} />
            </ListItem>
          </List>
          <div className={classes.icons}>
            <NavItem
              href={DIPACT_GITHUB_URL}
              label={GITHUB_BUTTON_LABEL}
              active
              external
            >
              <GitHubIcon />
            </NavItem>
            <IconButton onClick={onClickErrorLog} title={ERROR_BUTTON_LABEL} size="large">
              <BugReportIcon />
            </IconButton>
            <NavItem
              href={RouteConfig.Donate}
              label={DONATE_BUTTON_LABEL}
              active
            >
              <DonateIcon />
            </NavItem>
          </div>
        </div>
      </ClickAwayListener>
    </Drawer>
    <Toolbar />
    {children}
  </>;
};

export default MainMenu;

export const mainMenuDecorator = (values: IUseMainMenu) => {
  return (Component: () => JSX.Element) => () => (
    <useDIContext.Provider value={() => values}>
      <Component />
    </useDIContext.Provider>
  );
};
