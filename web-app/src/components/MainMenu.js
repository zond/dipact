/* eslint-disable no-restricted-globals */
import React from "react";
import {
	AppBar,
	Avatar,
	ClickAwayListener,
	MenuItem,
	Drawer,
	Toolbar,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Menu,
	Divider,
	Typography,
} from "@material-ui/core";
import { MenuIcon, GitHubIcon, DonateIcon, BugReportIcon } from "../icons";
import gtag from "ga-gtag";
import { withRouter } from "react-router-dom";

import * as helpers from "../helpers";
import ActivityContainer from "./ActivityContainer";
import Globals from "../Globals";
import DonateDialog from "./DonateDialog";
import ErrorsDialog from "./ErrorsDialog";
import SettingsDialog from "./SettingsDialog";
import FindGameDialog from "./FindGameDialog";
import Start from "./Start";
import GameList from "./GameList";
import { withStatsDialog } from "./StatsDialogWrapper";
import { RouteConfig } from "../pages/Router";

class MainMenu extends ActivityContainer {
	constructor(props) {
		super(props);
		this.openDrawer = this.openDrawer.bind(this);
		this.closeDrawer = this.closeDrawer.bind(this);
		this.renderGameList = this.renderGameList.bind(this);
		this.findGameByID = this.findGameByID.bind(this);
		this.renderOpenGames = this.renderOpenGames.bind(this);
		this.renderMyFinishedGames = this.renderMyFinishedGames.bind(this);
		this.renderMasteredFinishedGames =
			this.renderMasteredFinishedGames.bind(this);
		// Since onClickOutside in a webview seems to behave strangely.
		this.drawerOpenedAt = 0;
		this.state = {
			drawerOpen: false,
			activity: Start,
			activityProps: {
				urls: this.props.urls,
				findPrivateGame: this.findGameByID,
				findOpenGame: this.renderOpenGames,
				renderMasteredFinishedGames: this.renderMasteredFinishedGames,
				renderMyFinishedGames: this.renderMyFinishedGames,
			},
		};
		this.findGameDialog = null;
		this.settingsDialog = null;
		this.errorsDialog = null;
		this.donateDialog = null;
		this.history = props.history;
	}
	componentDidMount() {
		gtag("set", {
			page_title: "MainMenu",
			page_location: location.href,
		});
		gtag("event", "page_view");
	}
	findGameByID() {
		this.findGameDialog.setState({
			open: true,
			onFind: (gameID) => {
				if (gameID === "") {
					return;
				}
				const match = /\/Game\/([^/]+)/.exec(gameID);
				if (match) {
					gameID = match[1];
				}
				helpers
					.safeFetch(helpers.createRequest("/Game/" + gameID))
					.then((resp) => {
						if (resp.status === 200) {
							resp.json().then((js) => {
								this.setState({
									activity: GameList,
									activityProps: {
										label: gameID,
										key: "predefined-game-list",
										predefinedList: [js],
									},
								});
							});
						} else {
							helpers.snackbar(
								"Didn't find a game with ID " + gameID
							);
						}
					});
			},
		});
	}
	openDrawer() {
		this.drawerOpenedAt = new Date().getTime();
		this.setState({ drawerOpen: true });
	}
	closeDrawer() {
		this.setState({ drawerOpen: false });
	}
	renderMasteredFinishedGames() {
		this.setActivity(GameList, {
			label: "Finished game mastered games",
			key: "mastered-finished-games",
			url: this.props.urls["mastered-finished-games"],
		});
	}
	renderMyFinishedGames() {
		this.setActivity(GameList, {
			label: "My finished games",
			key: "my-finished-games",
			url: this.props.urls["my-finished-games"],
		});
	}
	renderOpenGames() {
		this.setActivity(GameList, {
			key: "open-games",
			label: "Open games",
			url: this.props.urls["open-games"],
		});
	}
	renderGameList(ev) {
		this.setActivity(GameList, {
			label: ev.currentTarget.getAttribute("label"),
			key: ev.currentTarget.getAttribute("urlkey"),
			url: this.props.urls[ev.currentTarget.getAttribute("urlkey")],
		});
	}
	render() {
		return (
			<React.Fragment>
				<AppBar position="fixed">
					<Toolbar>
						<IconButton
							edge="start"
							onClick={this.openDrawer}
							color="secondary"
						>
							<MenuIcon />
						</IconButton>
						<Typography style={{ flexGrow: 1 }}></Typography>
						<IconButton
							edge="end"
							onClick={(ev) => {
								this.setState({
									menuAnchorEl: ev.currentTarget,
								});
							}}
							color="secondary"
						>
							<Avatar
								alt="test"
								src={Globals.user.Picture}
								style={{
									width: "32px",
									height: "32px",
									border: "1px solid #FDE2B5",
								}}
							/>
						</IconButton>
						<Menu
							anchorEl={this.state.menuAnchorEl}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							onClose={(_) => {
								this.setState({ menuAnchorEl: null });
							}}
							open={!!this.state.menuAnchorEl}
						>
							<MenuItem
								key="email"
								style={{ fontWeight: "bold" }}
							>
								{Globals.user.Email}
							</MenuItem>
							<MenuItem
								key="stats"
								onClick={(_) => {
									this.props.statsDialogOptions.open(Globals.user);
									this.setState({
										menuAnchorEl: null,
									});
								}}
							>
								Player stats
							</MenuItem>

							<MenuItem key="logout" onClick={helpers.logout}>
								Logout
							</MenuItem>
						</Menu>
					</Toolbar>
				</AppBar>
				<div style={{ marginTop: "60px" }}>{this.renderActivity()}</div>
				<Drawer open={this.state.drawerOpen}>
					<ClickAwayListener
						onClickAway={(_) => {
							if (
								new Date().getTime() >
								this.drawerOpenedAt + 100
							) {
								this.closeDrawer();
							}
						}}
					>
						<div
							onClick={this.closeDrawer}
							style={{ width: "220px" }}
						>
							<List component="nav">
								<ListItem
									button
									onClick={() => this.history.push(RouteConfig.About)}
								>
									<ListItemText primary="About" />
								</ListItem>
								<ListItem
									style={{
										padding: "24px 16px 8px 16px",
										height: "40px",
									}}
								>
									<ListItemText
										primary="My Diplicity"
										disableTypography
										style={{
											color: "rgba(40, 26, 26, 0.56)",
											minHeight: "auto",
											minWidth: "auto",
											font: "500 14px / 48px Cabin, Roboto, sans-serif",
											margin: "0px 0px 2px",
										}}
									/>
								</ListItem>

								<ListItem
									button
									onClick={(_) => {
										this.setActivity(Start, {
											urls: this.props.urls,
											findPrivateGame: this.findGameByID,
											findOpenGame: this.renderOpenGames,
											renderMyFinishedGames:
												this.renderMyFinishedGames,
										});
									}}
								>
									<ListItemText primary="My games" />
								</ListItem>

								<ListItem
									button
									onClick={(_) => {
										this.setState({ menuAnchorEl: null });
										this.settingsDialog.setState({
											open: true,
										});
									}}
								>
									<ListItemText primary="Settings" />
								</ListItem>

								<Divider />

								<ListItem
									style={{
										padding: "24px 16px 8px 16px",
										height: "40px",
									}}
								>
									<ListItemText
										primary="Public games"
										disableTypography
										style={{
											color: "rgba(40, 26, 26, 0.56)",
											minHeight: "auto",
											minWidth: "auto",
											font: "500 14px / 48px Cabin, Roboto, sans-serif",
											margin: "0px 0px 2px",
										}}
									/>
								</ListItem>

								<ListItem
									button
									urlkey="open-games"
									label="Open games"
									onClick={this.renderGameList}
								>
									<ListItemText primary="Open to join" />
								</ListItem>
								<ListItem
									style={{ padding: "4px 16px" }}
									button
									urlkey="started-games"
									label="Started games"
									onClick={this.renderGameList}
								>
									<ListItemText primary="Started" />
								</ListItem>
								<ListItem
									button
									urlkey="finished-games"
									label="Finished games"
									onClick={this.renderGameList}
								>
									<ListItemText primary="Finished" />
								</ListItem>

								<Divider />

								<ListItem
									style={{
										padding: "24px 16px 8px 16px",
										height: "40px",
									}}
								>
									<ListItemText
										primary="Community"
										disableTypography
										style={{
											color: "rgba(40, 26, 26, 0.56)",
											minHeight: "auto",
											minWidth: "auto",
											font: "500 14px / 48px Cabin, Roboto, sans-serif",
											margin: "0px 0px 2px",
										}}
									/>
								</ListItem>

								<ListItem
									button
									onClick={(_) => {
										open("https://discord.gg/bu3JxYc");
									}}
								>
									<ListItemText primary="Chat" />
								</ListItem>

								<ListItem
									style={{ padding: "4px 16px" }}
									button
									onClick={(_) => {
										open(
											"https://groups.google.com/g/diplicity-talk"
										);
									}}
								>
									<ListItemText primary="Forum" />
								</ListItem>
								<Divider />
								<ListItem
									button
									onClick={(_) => {
										open(
											"https://diplicity.notion.site/diplicity/Diplicity-FAQ-7b4e0a119eb54c69b80b411f14d43bb9"
										);
									}}
								>
									<ListItemText primary="FAQ" />
								</ListItem>
								<ListItem
									button
									onClick={(_) => {
										this.setActivity(About);
									}}
								>
									<ListItemText primary="About" />
								</ListItem>
							</List>
							<div
								style={{
									width: "calc(100% - 16px)",
									display: "Flex",
									justifyContent: "space-around",
									padding: "0px 8px",
								}}
							>
								<div
									id="github"
									style={{ padding: "8px" }}
									onClick={(_) => {
										open("https://github.com/zond/dipact");
									}}
								>
									<GitHubIcon />
								</div>
								<div
									id="errorlog"
									style={{ padding: "8px" }}
									onClick={(_) => {
										this.errorsDialog.setState({
											open: true,
										});
									}}
								>
									<BugReportIcon />
								</div>
								<div
									id="donate"
									style={{ padding: "8px" }}
									onClick={(_) => {
										this.donateDialog.setState({
											open: true,
										});
									}}
								>
									<DonateIcon />
								</div>
							</div>
						</div>
					</ClickAwayListener>
				</Drawer>
				<FindGameDialog
					parentCB={(c) => {
						this.findGameDialog = c;
					}}
					key="find-game-dialog"
				/>
				<DonateDialog
					key="donate-dialog"
					parentCB={(c) => {
						this.donateDialog = c;
					}}
				/>
				<SettingsDialog
					key="settings-dialog"
					parentCB={(c) => {
						this.settingsDialog = c;
					}}
				/>
				<ErrorsDialog
					key="errors-dialog"
					parentCB={(c) => {
						this.errorsDialog = c;
					}}
				/>
			</React.Fragment>
		);
	}
}

export default withStatsDialog(withRouter(MainMenu));