import * as helpers from '%{ cb "/js/helpers.js" }%';

import ActivityContainer from '%{ cb "/js/activity_container.js" }%';
import FindGameDialog from '%{ cb "/js/find_game_dialog.js" }%';
import Start from '%{ cb "/js/start.js" }%';
import GameList from '%{ cb "/js/game_list.js" }%';
import Game from '%{ cb "/js/game.js" }%';

export default class MainMenu extends ActivityContainer {
	constructor(props) {
		super(props);
		this.openDrawer = this.openDrawer.bind(this);
		this.closeDrawer = this.closeDrawer.bind(this);
		this.renderGameList = this.renderGameList.bind(this);
		this.closeMenu = this.closeMenu.bind(this);
		this.openMenu = this.openMenu.bind(this);
		this.logout = this.logout.bind(this);
		this.findGameByID = this.findGameByID.bind(this);
		this.renderOpenGames = this.renderOpenGames.bind(this);
		this.state = {
			drawerOpen: false,
			menuOpen: false,
			activity: Start,
			activityProps: {
				urls: this.props.urls,
				findPrivateGame: this.findGameByID,
				findOpenGame: this.renderOpenGames
			}
		};
		this.findGameDialog = null;
		helpers.urlMatch(
			[
				[
					/^\/Game\/([^\/]+)/,
					match => {
						this.state.activity = Game;
						this.state.activityProps = {
							gamePromise: helpers
								.safeFetch(
									helpers.createRequest("/Game/" + match[1])
								)
								.then(resp => resp.json()),
							close: _ => {
								this.setActivity(Start, {
									urls: this.props.urls,
									findPrivateGame: this.findGameByID,
									findOpenGame: this.renderOpenGames
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
	findGameByID() {
		this.findGameDialog.setState({
			open: true,
			onClick: gameID => {
				let match = /\/Game\/([^/]+)/.exec(gameID);
				if (match) {
					gameID = match[1];
				}
				helpers
					.safeFetch(helpers.createRequest("/Game/" + gameID))
					.then(resp => resp.json())
					.then(js => {
						this.setState({
							activity: GameList,
							activityProps: {
								key: "predefined-game-list",
								predefinedList: [js]
							}
						});
					});
			}
		});
	}
	logout() {
		localStorage.removeItem("token");
		location.reload();
	}
	openDrawer() {
		this.setState({ drawerOpen: true });
	}
	closeDrawer() {
		this.setState({ drawerOpen: false });
	}
	openMenu(ev) {
		this.setState({ anchorEl: ev.currentTarget, menuOpen: true });
	}
	closeMenu() {
		this.setState({ menuOpen: false });
	}
	renderOpenGames() {
		this.setActivity(GameList, {
			key: "open-games",
			url: this.props.urls["open-games"]
		});
	}
	renderGameList(ev) {
		this.setActivity(GameList, {
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
							onClick={this.openMenu}
							color="secondary"
						>
							{helpers.createIcon("\ue853")}
						</MaterialUI.IconButton>
						<MaterialUI.Menu
							anchorEl={this.state.anchorEl}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right"
							}}
							transformOrigin={{
								vertical: "top",
								horizontal: "right"
							}}
							onClose={this.closeMenu}
							open={this.state.menuOpen}
						>
							<MaterialUI.MenuItem
								key="close-menu"
								onClick={this.closeMenu}
							>
								Settings
							</MaterialUI.MenuItem>
							<MaterialUI.MenuItem
								key="logout"
								onClick={this.logout}
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
											findOpenGame: this.renderOpenGames
										});
									}}
								>
									<MaterialUI.ListItemText primary="Start" />
								</MaterialUI.ListItem>
								<MaterialUI.ListItem
									button
									urlkey="my-started-games"
									onClick={this.renderGameList}
								>
									<MaterialUI.ListItemText primary="My started games" />
								</MaterialUI.ListItem>
								<MaterialUI.ListItem
									button
									urlkey="my-staging-games"
									onClick={this.renderGameList}
								>
									<MaterialUI.ListItemText primary="My staging games" />
								</MaterialUI.ListItem>
								<MaterialUI.ListItem
									button
									urlkey="my-finished-games"
									onClick={this.renderGameList}
								>
									<MaterialUI.ListItemText primary="My finished games" />
								</MaterialUI.ListItem>
								<MaterialUI.ListItem
									button
									urlkey="open-games"
									onClick={this.renderGameList}
								>
									<MaterialUI.ListItemText primary="Open games" />
								</MaterialUI.ListItem>
								<MaterialUI.ListItem
									button
									urlkey="started-games"
									onClick={this.renderGameList}
								>
									<MaterialUI.ListItemText primary="Started games" />
								</MaterialUI.ListItem>
								<MaterialUI.ListItem
									button
									urlkey="finished-games"
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
				<FindGameDialog parent={this} key="find-game-dialog" />
			</React.Fragment>
		);
	}
}
