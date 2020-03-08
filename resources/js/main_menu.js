import ActivityContainer from './activity_container.js';
import Notifications from './notifications.js';
import GameList from './game_list.js';

export default class MainMenu extends ActivityContainer {
	constructor(props) {
		super(props);
		this.state = {
			drawerOpen: false,
			activity: Notifications,
		};
		this.openDrawer = this.openDrawer.bind(this);
		this.closeDrawer = this.closeDrawer.bind(this);
	}
	openDrawer() {
		this.setState({drawerOpen: true});
	}
	closeDrawer() {
		this.setState({drawerOpen: false});
	}
	render() {
		return (
			<div>
				<MaterialUI.IconButton onClick={this.openDrawer}>
					<i className="material-icons">&#xE5D2;</i>
				</MaterialUI.IconButton>
          			{this.renderActivity()}
				<MaterialUI.Drawer open={this.state.drawerOpen}>
			        <MaterialUI.ClickAwayListener onClickAway={this.closeDrawer}>
         				<div onClick={this.closeDrawer}>
         					<MaterialUI.List component="nav">
         						<MaterialUI.ListItem button onClick={_ => { this.setActivity(Notifications) }}>
         							<MaterialUI.ListItemText primary="Notifications" />
         						</MaterialUI.ListItem>
         						<MaterialUI.ListItem button onClick={_ => { this.setActivity(GameList, {key: 0, url: this.props.parent_state.urls.my_started_games_url.toString()}) }}>
         							<MaterialUI.ListItemText primary="My started games" />
         						</MaterialUI.ListItem>
         						<MaterialUI.ListItem button onClick={_ => { this.setActivity(GameList, {key: 1, url: this.props.parent_state.urls.my_staging_games_url.toString()}) }}>
         							<MaterialUI.ListItemText primary="My staging games" />
         						</MaterialUI.ListItem>
         						<MaterialUI.ListItem button onClick={_ => { this.setActivity(GameList, {key: 2, url: this.props.parent_state.urls.my_finished_games_url.toString()}) }}>
         							<MaterialUI.ListItemText primary="My finished games" />
         						</MaterialUI.ListItem>
         						<MaterialUI.ListItem button onClick={_ => { this.setActivity(GameList, {key: 3, url: this.props.parent_state.urls.open_games_url.toString()}) }}>
         							<MaterialUI.ListItemText primary="Open games" />
         						</MaterialUI.ListItem>
         						<MaterialUI.ListItem button onClick={_ => { this.setActivity(GameList, {key: 4, url: this.props.parent_state.urls.started_games_url.toString()}) }}>
         							<MaterialUI.ListItemText primary="Started games" />
         						</MaterialUI.ListItem>
         						<MaterialUI.ListItem button onClick={_ => { this.setActivity(GameList, {key: 5, url: this.props.parent_state.urls.finished_games_url.toString()}) }}>
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

