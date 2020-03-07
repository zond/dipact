export default class MainMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			drawerOpen: false
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
				<MaterialUI.Drawer open={this.state.drawerOpen}>
			        <MaterialUI.ClickAwayListener onClickAway={this.closeDrawer}>
         				<div onClick={this.closeDrawer}>
         					<MaterialUI.List component="nav">
         						<MaterialUI.ListItem button>
         							<MaterialUI.ListItemText primary="Notifications" />
         						</MaterialUI.ListItem>
         						<MaterialUI.ListItem button>
         							<MaterialUI.ListItemText primary="My started games" />
         						</MaterialUI.ListItem>
         						<MaterialUI.ListItem button>
         							<MaterialUI.ListItemText primary="My staging games" />
         						</MaterialUI.ListItem>
         						<MaterialUI.ListItem button>
         							<MaterialUI.ListItemText primary="My finished games" />
         						</MaterialUI.ListItem>
         						<MaterialUI.ListItem button>
         							<MaterialUI.ListItemText primary="Open games" />
         						</MaterialUI.ListItem>
         						<MaterialUI.ListItem button>
         							<MaterialUI.ListItemText primary="Started games" />
         						</MaterialUI.ListItem>
         						<MaterialUI.ListItem button>
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

