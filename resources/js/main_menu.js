import ActivityContainer from '%{ cb "./activity_container.js" }%';
import Notifications from '%{ cb "./notifications.js" }%';
import GameList from '%{ cb "./game_list.js" }%';

export default class MainMenu extends ActivityContainer {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      activity: Notifications
    };
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.renderGameList = this.renderGameList.bind(this);
  }
  openDrawer() {
    this.setState({ drawerOpen: true });
  }
  closeDrawer() {
    this.setState({ drawerOpen: false });
  }
  renderGameList(ev) {
    this.setActivity(GameList, {
      key: ev.currentTarget.getAttribute("gamelistkey"),
      url: this.props.parent_state.urls[ev.currentTarget.getAttribute("urlkey")]
    });
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
                  gamelistkey="1"
                  urlkey="my_started_games_url"
                  onClick={this.renderGameList}
                >
                  <MaterialUI.ListItemText primary="My started games" />
                </MaterialUI.ListItem>
                <MaterialUI.ListItem
                  button
                  gamelistkeyey="2"
                  urlkey="my_staging_games_url"
                  onClick={this.renderGameList}
                >
                  <MaterialUI.ListItemText primary="My staging games" />
                </MaterialUI.ListItem>
                <MaterialUI.ListItem
                  button
                  gamelistkey="3"
                  urlkey="my_finished_games_url"
                  onClick={this.renderGameList}
                >
                  <MaterialUI.ListItemText primary="My finished games" />
                </MaterialUI.ListItem>
                <MaterialUI.ListItem
                  button
                  gamelistkey="4"
                  urlkey="open_games_url"
                  onClick={this.renderGameList}
                >
                  <MaterialUI.ListItemText primary="Open games" />
                </MaterialUI.ListItem>
                <MaterialUI.ListItem
                  button
                  gamelistkey="5"
                  urlkey="started_games_url"
                  onClick={this.renderGameList}
                >
                  <MaterialUI.ListItemText primary="Started games" />
                </MaterialUI.ListItem>
                <MaterialUI.ListItem
                  button
                  gamelistkey="6"
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
