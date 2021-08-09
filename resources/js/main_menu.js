import * as helpers from '%{ cb "/js/helpers.js" }%';

import ActivityContainer from '%{ cb "/js/activity_container.js" }%';
import FindGameDialog from '%{ cb "/js/find_game_dialog.js" }%';
import Start from '%{ cb "/js/start.js" }%';
import GameList from '%{ cb "/js/game_list.js" }%';
import Game from '%{ cb "/js/game.js" }%';
import SettingsDialog from '%{ cb "/js/settings_dialog.js" }%';
import ErrorsDialog from '%{ cb "/js/errors_dialog.js" }%';
import StatsDialog from '%{ cb "/js/stats_dialog.js" }%';
import About from '%{ cb "/js/about.js" }%';
import DonateDialog from '%{ cb "/js/donate_dialog.js" }%';

export default class MainMenu extends ActivityContainer {
	constructor(props) {
		super(props);
		this.openDrawer = this.openDrawer.bind(this);
		this.closeDrawer = this.closeDrawer.bind(this);
		this.renderGameList = this.renderGameList.bind(this);
		this.findGameByID = this.findGameByID.bind(this);
		this.renderOpenGames = this.renderOpenGames.bind(this);
		this.renderMyFinishedGames = this.renderMyFinishedGames.bind(this);
		// Since onClickOutside in a webview seems to behave strangely.
		this.drawerOpenedAt = 0;
		this.state = {
			drawerOpen: false,
			activity: Start,
			statsDialogOpen: false,
			activityProps: {
				urls: this.props.urls,
				findPrivateGame: this.findGameByID,
				findOpenGame: this.renderOpenGames,
				renderMyFinishedGames: this.renderMyFinishedGames,
			},
		};
		this.findGameDialog = null;
		this.settingsDialog = null;
		this.errorsDialog = null;
		this.donateDialog = null;
		helpers.urlMatch(
			[
				[
					/^\/Game\/([^\/]+)/,
					(match) => {
						this.state.activity = Game;
						this.state.activityProps = {
							gamePromise: (_) => {
								return helpers
									.safeFetch(
										helpers.createRequest(
											"/Game/" + match[1]
										)
									)
									.then((resp) => resp.json());
							},
							close: (_) => {
								this.setActivity(Start, {
									urls: this.props.urls,
									findPrivateGame: this.findGameByID,
									findOpenGame: this.renderOpenGames,
									renderMyFinishedGames:
										this.renderMyFinishedGames,
								});
							},
						};
					},
				],
			],
			(_) => {
				history.pushState("", "", "/");
			}
		);
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
				if (gameID == "") {
					return;
				}
				const match = /\/Game\/([^/]+)/.exec(gameID);
				if (match) {
					gameID = match[1];
				}
				helpers
					.safeFetch(helpers.createRequest("/Game/" + gameID))
					.then((resp) => {
						if (resp.status == 200) {
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
				<MaterialUI.AppBar position="fixed">
					<MaterialUI.Toolbar>
						<MaterialUI.IconButton
							edge="start"
							onClick={this.openDrawer}
							color="secondary"
						>
							{helpers.createIcon("\ue5d2")}
						</MaterialUI.IconButton>
						<MaterialUI.Typography
							style={{ flexGrow: 1 }}
						></MaterialUI.Typography>
						<MaterialUI.IconButton
							edge="end"
							onClick={(ev) => {
								this.setState({
									menuAnchorEl: ev.currentTarget,
								});
							}}
							color="secondary"
						>
							<MaterialUI.Avatar
								alt="test"
								src={Globals.user.Picture}
								style={{
									width: "32px",
									height: "32px",
									border: "1px solid #FDE2B5",
								}}
							/>
						</MaterialUI.IconButton>
						<MaterialUI.Menu
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
							<MaterialUI.MenuItem
								key="email"
								style={{ fontWeight: "bold" }}
							>
								{Globals.user.Email}
							</MaterialUI.MenuItem>
							<MaterialUI.MenuItem
								key="stats"
								onClick={(_) => {
									this.setState({
										menuAnchorEl: null,
										statsDialogOpen: true,
									});
								}}
							>
								Player stats
							</MaterialUI.MenuItem>

							<MaterialUI.MenuItem
								key="logout"
								onClick={helpers.logout}
							>
								Logout
							</MaterialUI.MenuItem>
						</MaterialUI.Menu>
					</MaterialUI.Toolbar>
				</MaterialUI.AppBar>
				<div style={{ marginTop: "60px" }}>{this.renderActivity()}</div>
				<MaterialUI.Drawer open={this.state.drawerOpen}>
					<MaterialUI.ClickAwayListener
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
							<MaterialUI.List component="nav">
								<MaterialUI.ListItem
									button
									onClick={(_) => {
										this.setActivity(About);
									}}
								>
									<MaterialUI.ListItemText primary="About" />
								</MaterialUI.ListItem>
								<MaterialUI.ListItem
									style={{
										padding: "24px 16px 8px 16px",
										height: "40px",
									}}
								>
									<MaterialUI.ListItemText
										primary="My Diplicity"
										disableTypography
										className={helpers.scopedClass(`
    color: rgba(40, 26, 26, 0.56);
    min-height: auto;
    min-width: auto;
    font: 500 14px / 48px Cabin, Roboto, sans-serif;
    margin: 0px 0px 2px;

              	`)}
									/>
								</MaterialUI.ListItem>

								<MaterialUI.ListItem
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
									<MaterialUI.ListItemText primary="My games" />
								</MaterialUI.ListItem>

								<MaterialUI.ListItem
									button
									onClick={(_) => {
										this.setState({ menuAnchorEl: null });
										this.settingsDialog.setState({
											open: true,
										});
									}}
								>
									<MaterialUI.ListItemText primary="Settings" />
								</MaterialUI.ListItem>

								<MaterialUI.Divider />

								<MaterialUI.ListItem
									style={{
										padding: "24px 16px 8px 16px",
										height: "40px",
									}}
								>
									<MaterialUI.ListItemText
										primary="Public games"
										disableTypography
										className={helpers.scopedClass(`
    color: rgba(40, 26, 26, 0.56);
    min-height: auto;
    min-width: auto;
    font: 500 14px / 48px Cabin, Roboto, sans-serif;
    margin: 0px 0px 2px;

              	`)}
									/>
								</MaterialUI.ListItem>

								<MaterialUI.ListItem
									button
									urlkey="open-games"
									label="Open games"
									onClick={this.renderGameList}
								>
									<MaterialUI.ListItemText primary="Open games" />
								</MaterialUI.ListItem>
								<MaterialUI.ListItem
									style={{ padding: "4px 16px" }}
									button
									urlkey="started-games"
									label="Started games"
									onClick={this.renderGameList}
								>
									<MaterialUI.ListItemText primary="Started games" />
								</MaterialUI.ListItem>
								<MaterialUI.ListItem
									button
									urlkey="finished-games"
									label="Finished games"
									onClick={this.renderGameList}
								>
									<MaterialUI.ListItemText primary="Finished games" />
								</MaterialUI.ListItem>

								<React.Fragment>
									<MaterialUI.Divider />

									<MaterialUI.ListItem
										style={{
											padding: "24px 16px 8px 16px",
											height: "40px",
										}}
									>
										<MaterialUI.ListItemText
											primary="Game mastered games"
											disableTypography
											className={helpers.scopedClass(`
    color: rgba(40, 26, 26, 0.56);
    min-height: auto;
    min-width: auto;
    font: 500 14px / 48px Cabin, Roboto, sans-serif;
    margin: 0px 0px 2px;

              	`)}
										/>
									</MaterialUI.ListItem>

									<MaterialUI.ListItem
										button
										urlkey="mastered-staging-games"
										label="Staging games game mastered by me"
										onClick={this.renderGameList}
									>
										<MaterialUI.ListItemText primary="Staging games" />
									</MaterialUI.ListItem>
									<MaterialUI.ListItem
										style={{ padding: "4px 16px" }}
										button
										urlkey="mastered-started-games"
										label="Started games game mastered by me"
										onClick={this.renderGameList}
									>
										<MaterialUI.ListItemText primary="Started games" />
									</MaterialUI.ListItem>
									<MaterialUI.ListItem
										button
										urlkey="mastered-finished-games"
										label="Finished games game mastered by me"
										onClick={this.renderGameList}
									>
										<MaterialUI.ListItemText primary="Finished games" />
									</MaterialUI.ListItem>
								</React.Fragment>
								<MaterialUI.Divider />

								<MaterialUI.ListItem
									style={{
										padding: "24px 16px 8px 16px",
										height: "40px",
									}}
								>
									<MaterialUI.ListItemText
										primary="Community"
										disableTypography
										className={helpers.scopedClass(`
    color: rgba(40, 26, 26, 0.56);
    min-height: auto;
    min-width: auto;
    font: 500 14px / 48px Cabin, Roboto, sans-serif;
    margin: 0px 0px 2px;

              	`)}
									/>
								</MaterialUI.ListItem>

								<MaterialUI.ListItem
									button
									onClick={(_) => {
										open("https://discord.gg/bu3JxYc");
									}}
								>
									<MaterialUI.ListItemText primary="Chat" />
								</MaterialUI.ListItem>

								<MaterialUI.ListItem
									style={{ padding: "4px 16px" }}
									button
									onClick={(_) => {
										open(
											"https://groups.google.com/g/diplicity-talk"
										);
									}}
								>
									<MaterialUI.ListItemText primary="Forum" />
								</MaterialUI.ListItem>

								<MaterialUI.ListItem
									button
									onClick={(_) => {
										open(
											"https://sites.google.com/corp/view/diplicity"
										);
									}}
								>
									<MaterialUI.ListItemText primary="Help" />
								</MaterialUI.ListItem>

								<MaterialUI.Divider />
							</MaterialUI.List>
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
									<MaterialUI.SvgIcon>
										<path
											fill="#281A1A"
											d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
										/>
									</MaterialUI.SvgIcon>
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
									{helpers.createIcon("\ue868")}
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
									<img
										src="/static/img/donate.svg"
										width="24"
										height="24"
									/>
								</div>
							</div>
						</div>
					</MaterialUI.ClickAwayListener>
				</MaterialUI.Drawer>
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
				{this.state.statsDialogOpen ? (
					<StatsDialog
						open={this.state.statsDialogOpen}
						user={Globals.user}
						onClose={(_) => {
							this.setState({ statsDialogOpen: false });
						}}
					/>
				) : (
					""
				)}
			</React.Fragment>
		);
	}
}
