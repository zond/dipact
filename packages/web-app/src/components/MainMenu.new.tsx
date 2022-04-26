import {
  AppBar,
  Avatar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { useMainMenu } from "../hooks/useMainMenu";
import { MenuIcon, GitHubIcon } from "../icons";
import { RouteConfig } from "../pages/RouteConfig";
import useSearchParams from "../hooks/useSearchParams";
import NavItem from "./NavItem";
import { links, translateKeys as tk } from "@diplicity/common";
import { useTranslation } from "react-i18next";

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
  menuButtonTitleContainer: {
    display: "flex",
    gap: theme.spacing(1),
    alignItems: "center",
  },
}));

interface MainMenuProps {
  title: string;
  children: React.ReactNode;
}

const MainMenu = ({ children, title }: MainMenuProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const history = useHistory();
  const classes = useStyles();
  const { t } = useTranslation();
  const { setParam } = useSearchParams();
  const { logout, user } = useMainMenu();

  const onClickAvatar = (e: React.MouseEvent<HTMLButtonElement>) =>
    setMenuAnchorEl(e.currentTarget);
  const onClickPlayerStats = () => setParam("player-stats", user?.Id as string);
  const onClickCreateGame = () => history.push(RouteConfig.CreateGame);

  const onClickAbout = () => window.open(links.notion, "_blank");
  const onClickChat = () => window.open(links.diplicityDiscord, "_blank");
  const onClickForum = () => window.open(links.diplicityForum, "_blank");
  const onClickFAQ = () => window.open(links.diplicityFAQ, "_blank");

  return (
    <>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <div className={classes.menuButtonTitleContainer}>
            <IconButton
              edge="start"
              onClick={() => setDrawerOpen(true)}
              color="secondary"
              title={t(tk.mainMenu.drawer.button.title)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">{title}</Typography>
          </div>
          {user && (
            <>
              <IconButton
                edge="end"
                onClick={onClickAvatar}
                color="secondary"
                title={t(tk.mainMenu.userMenu.button.title)}
              >
                <Avatar
                  alt={t(tk.mainMenu.userMenu.userAvatar.altText)}
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
                /* istanbul ignore next */ 
                onClose={() => setMenuAnchorEl(null)}
                open={!!menuAnchorEl}
              >
                <MenuItem key="email" className={classes.email} disabled>
                  {user.Email}
                </MenuItem>
                <MenuItem key="stats" onClick={onClickPlayerStats}>
                  {t(tk.mainMenu.userMenu.playerStatsMenuItem.label)}
                </MenuItem>

                <MenuItem key="logout" onClick={logout}>
                  {t(tk.mainMenu.userMenu.logoutMenuItem.label)}
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className={classes.drawer} title={t(tk.mainMenu.drawer.title)}>
          <List component="nav">

            <ListItem className={classes.menuItemSectionHeader}>
              <ListItemText primary={t(tk.mainMenu.drawer.myDiplicitySection.title)} disableTypography />
            </ListItem>

            <ListItem button onClick={onClickCreateGame}>
              <ListItemText primary={t(tk.mainMenu.drawer.createGameMenuItem.title)} />
            </ListItem>

            <Divider />

            <ListItem className={classes.menuItemSectionHeader}>
              <ListItemText primary={t(tk.mainMenu.drawer.communitySection.title)} disableTypography />
            </ListItem>

            <ListItem button onClick={onClickChat}>
              <ListItemText primary={t(tk.mainMenu.drawer.chatMenuItem.title)} />
            </ListItem>

            <ListItem button onClick={onClickForum}>
              <ListItemText primary={t(tk.mainMenu.drawer.forumMenuItem.title)} />
            </ListItem>

            <Divider />

            <ListItem button onClick={onClickFAQ}>
              <ListItemText primary={t(tk.mainMenu.drawer.faqMenuItem.title)} />
            </ListItem>

            <ListItem button onClick={onClickAbout}>
              <ListItemText primary={t(tk.mainMenu.drawer.aboutMenuItem.title)} />
            </ListItem>
          </List>
          <div className={classes.icons}>
            <NavItem
              href={links.dipactGithub}
              label={t(tk.mainMenu.drawer.githubButton.title)}
              active
              external
            >
              <GitHubIcon />
            </NavItem>
          </div>
        </div>
      </Drawer>
      <Toolbar />
      {children}
    </>
  );
};

export default MainMenu;
