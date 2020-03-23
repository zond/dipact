import * as helpers from '%{ cb "./helpers.js" }%';

import ActivityContainer from '%{ cb "./activity_container.js" }%';
import Notifications from '%{ cb "./notifications.js" }%';
import GameList from '%{ cb "./game_list.js" }%';

export default class MainMenu extends ActivityContainer {
	constructor(props) {
		super(props);
		this.state = {
			drawerOpen: false,
			menuOpen: false,
			activity: Notifications
		};
		this.openDrawer = this.openDrawer.bind(this);
		this.closeDrawer = this.closeDrawer.bind(this);
		this.renderGameList = this.renderGameList.bind(this);
		this.closeMenu = this.closeMenu.bind(this);
		this.openMenu = this.openMenu.bind(this);
		this.logout = this.logout.bind(this);
	}
	logout() {
		localStorage.removeItem("token");
		location.replace("/");
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
	renderGameList(ev) {
		this.setActivity(GameList, {
			key: ev.currentTarget.getAttribute("urlkey"),
			url: this.props.urls[ev.currentTarget.getAttribute("urlkey")],
			variants: this.props.variants
		});
	}
	render() {
		return (
			<div>
				<MaterialUI.AppBar position="fixed">
					<MaterialUI.Toolbar>
						<MaterialUI.IconButton
							edge="start"
							onClick={this.openDrawer}
						>
							{helpers.createIcon("\ue5d2")}
						</MaterialUI.IconButton>
						<MaterialUI.Typography
							style={{ flexGrow: 1 }}
						></MaterialUI.Typography>
						<MaterialUI.IconButton
							edge="end"
							onClick={this.openMenu}
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
								key="logout"
								onClick={this.logout}
							>
								Logout
							</MaterialUI.MenuItem>
							<MaterialUI.MenuItem
								key="close-menu"
								onClick={this.closeMenu}
							>
								Settings
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
										this.setActivity(Notifications);
									}}
								>
									<MaterialUI.ListItemText primary="Notifications" />
								</MaterialUI.ListItem>
								<MaterialUI.ListItem
									button
									urlkey="my_started_games_url"
									onClick={this.renderGameList}
								>
									<MaterialUI.ListItemText primary="My started games" />
								</MaterialUI.ListItem>
								<MaterialUI.ListItem
									button
									urlkey="my_staging_games_url"
									onClick={this.renderGameList}
								>
									<MaterialUI.ListItemText primary="My staging games" />
								</MaterialUI.ListItem>
								<MaterialUI.ListItem
									button
									urlkey="my_finished_games_url"
									onClick={this.renderGameList}
								>
									<MaterialUI.ListItemText primary="My finished games" />
								</MaterialUI.ListItem>
								<MaterialUI.ListItem
									button
									urlkey="open_games_url"
									onClick={this.renderGameList}
								>
									<MaterialUI.ListItemText primary="Open games" />
								</MaterialUI.ListItem>
								<MaterialUI.ListItem
									button
									urlkey="started_games_url"
									onClick={this.renderGameList}
								>
									<MaterialUI.ListItemText primary="Started games" />
								</MaterialUI.ListItem>
								<MaterialUI.ListItem
									button
									urlkey="finished_games_url"
									onClick={this.renderGameList}
								>
									<MaterialUI.ListItemText primary="Finished games" />
								</MaterialUI.ListItem>
							</MaterialUI.List>
						</div>
					</MaterialUI.ClickAwayListener>
				</MaterialUI.Drawer>
			</div>
		);
	}
}
