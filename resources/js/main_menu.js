import * as helpers from '%{ cb "/js/helpers.js" }%';

import ActivityContainer from '%{ cb "/js/activity_container.js" }%';
import FindGameDialog from '%{ cb "/js/find_game_dialog.js" }%';
import Start from '%{ cb "/js/start.js" }%';
import GameList from '%{ cb "/js/game_list.js" }%';
import Game from '%{ cb "/js/game.js" }%';
import SettingsDialog from '%{ cb "/js/settings_dialog.js" }%';
import StatsDialog from '%{ cb "/js/stats_dialog.js" }%';

export default class MainMenu extends ActivityContainer {
	constructor(props) {
		super(props);
		this.openDrawer = this.openDrawer.bind(this);
		this.closeDrawer = this.closeDrawer.bind(this);
		this.renderGameList = this.renderGameList.bind(this);
		this.findGameByID = this.findGameByID.bind(this);
		this.renderOpenGames = this.renderOpenGames.bind(this);
		this.renderMyStagingGames = this.renderMyStagingGames.bind(this);
		this.state = {
			drawerOpen: false,
			activity: Start,
			statsDialogOpen: false,
			activityProps: {
				urls: this.props.urls,
				findPrivateGame: this.findGameByID,
				findOpenGame: this.renderOpenGames,
				myStagingGames: this.renderMyStagingGames
			}
		};
		this.findGameDialog = null;
		this.settingsDialog = null;
		helpers.urlMatch(
			[
				[
					/^\/Game\/([^\/]+)/,
					match => {
						this.state.activity = Game;
						this.state.activityProps = {
							gamePromise: _ => {
								return helpers
									.safeFetch(
										helpers.createRequest(
											"/Game/" + match[1]
										)
									)
									.then(resp => resp.json());
							},
							close: _ => {
								this.setActivity(Start, {
									urls: this.props.urls,
									findPrivateGame: this.findGameByID,
									findOpenGame: this.renderOpenGames,
									myStagingGames: this.renderMyStagingGames
								});
							}
						};
					}
				]
			],
			_ => {
				history.pushState("", "", "/");
			}
		);
	}
	componentDidMount() {
		gtag("set", { page: "MainMenu" });
		gtag("event", "page_view");
	}
	findGameByID() {
		this.findGameDialog.setState({
			open: true,
			onFind: gameID => {
				if (gameID == "") {
					return;
				}
				const match = /\/Game\/([^/]+)/.exec(gameID);
				if (match) {
					gameID = match[1];
				}
				helpers
					.safeFetch(helpers.createRequest("/Game/" + gameID))
					.then(resp => {
						if (resp.status == 200) {
							resp.json().then(js => {
								this.setState({
									activity: GameList,
									activityProps: {
										label: gameID,
										key: "predefined-game-list",
										predefinedList: [js]
									}
								});
							});
						} else {
							helpers.snackbar(
								"Didn't find a game with ID " + gameID
							);
						}
					});
			}
		});
	}
	openDrawer() {
		this.setState({ drawerOpen: true });
	}
	closeDrawer() {
		this.setState({ drawerOpen: false });
	}
	renderMyStagingGames() {
		this.setActivity(GameList, {
			label: "My staging games",
			key: "my-staging-games",
			url: this.props.urls["my-staging-games"]
		});
	}
	renderOpenGames() {
		this.setActivity(GameList, {
			key: "open-games",
			label: "Open games",
			url: this.props.urls["open-games"]
		});
	}
	renderGameList(ev) {
		this.setActivity(GameList, {
			label: ev.currentTarget.getAttribute("label"),
			key: ev.currentTarget.getAttribute("urlkey"),
			url: this.props.urls[ev.currentTarget.getAttribute("urlkey")]
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
							onClick={ev => {
								this.setState({
									menuAnchorEl: ev.currentTarget
								});
							}}
							color="secondary"
						>
							{helpers.createIcon("\ue853")}
						</MaterialUI.IconButton>
						<MaterialUI.Menu
							anchorEl={this.state.menuAnchorEl}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right"
							}}
							transformOrigin={{
								vertical: "top",
								horizontal: "right"
							}}
							onClose={_ => {
								this.setState({ menuAnchorEl: null });
							}}
							open={!!this.state.menuAnchorEl}
						>
							<MaterialUI.MenuItem
								key="settings"
								onClick={_ => {
									this.setState({ menuAnchorEl: null });
									this.settingsDialog.setState({
										open: true
									});
								}}
							>
								Settings
							</MaterialUI.MenuItem>
							<MaterialUI.MenuItem
								key="stats"
								onClick={_ => {
									this.setState({
										menuAnchorEl: null,
										statsDialogOpen: true
									});
								}}
							>
								Stats
							</MaterialUI.MenuItem>
							<MaterialUI.MenuItem
								key="help-wiki"
								onClick={_ => {
									window.open(
										"https://sites.google.com/corp/view/diplicity"
									);
								}}
							>
								Help
							</MaterialUI.MenuItem>
							<MaterialUI.MenuItem
								key="forum"
								onClick={_ => {
									window.open(
										"https://groups.google.com/forum/#!forum/diplicity-talk"
									);
								}}
							>
								Forum
							</MaterialUI.MenuItem>
							<MaterialUI.MenuItem
								key="chat"
								onClick={_ => {
									window.open("https://discord.gg/bu3JxYc");
								}}
							>
								Chat
							</MaterialUI.MenuItem>
							<MaterialUI.MenuItem
								key="source"
								onClick={_ => {
									window.open(
										"https://github.com/zond/dipact"
									);
								}}
							>
								Source code
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
						onClickAway={this.closeDrawer}
					>
						<div onClick={this.closeDrawer}>
							<MaterialUI.List component="nav">
								<MaterialUI.ListItem
									button
									onClick={_ => {
										this.setActivity(Start, {
											urls: this.props.urls,
											findPrivateGame: this.findGameByID,
											findOpenGame: this.renderOpenGames,
											myStagingGames: this
												.renderMyStagingGames
										});
									}}
								>
									<MaterialUI.ListItemText primary="Start" />
								</MaterialUI.ListItem>
								<MaterialUI.ListItem
									button
									urlkey="my-started-games"
									label="My started games"
									onClick={this.renderGameList}
								>
									<MaterialUI.ListItemText primary="My started games" />
								</MaterialUI.ListItem>
								<MaterialUI.ListItem
									button
									urlkey="my-staging-games"
									label="My staging games"
									onClick={this.renderGameList}
								>
									<MaterialUI.ListItemText primary="My staging games" />
								</MaterialUI.ListItem>
								<MaterialUI.ListItem
									button
									urlkey="my-finished-games"
									label="My finished games"
									onClick={this.renderGameList}
								>
									<MaterialUI.ListItemText primary="My finished games" />
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
								<MaterialUI.ListItem
									button
									onClick={this.findGameByID}
								>
									<MaterialUI.ListItemText primary="Lookup game" />
								</MaterialUI.ListItem>
							</MaterialUI.List>
						</div>
					</MaterialUI.ClickAwayListener>
				</MaterialUI.Drawer>
				<FindGameDialog
					parentCB={c => {
						this.findGameDialog = c;
					}}
					key="find-game-dialog"
				/>
				<SettingsDialog
					key="settings-dialog"
					parentCB={c => {
						this.settingsDialog = c;
					}}
				/>
				{this.state.statsDialogOpen ? (
					<StatsDialog
						open={this.state.statsDialogOpen}
						user={Globals.user}
						onClose={_ => {
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
