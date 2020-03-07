export default class MainMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			drawerOpen: false
		};
		this.toggleDrawer = this.toggleDrawer.bind(this);
	}
	toggleDrawer() {
		this.setState({drawerOpen: !this.state.drawerOpen});
	}
	render() {
		return (
			<div>
				<MaterialUI.IconButton onClick={this.toggleDrawer}>
					<i className="material-icons">&#xE5D2;</i>
				</MaterialUI.IconButton>
				<MaterialUI.Drawer open={this.state.drawerOpen}>
					<div onClick={this.toggleDrawer}>
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
				</MaterialUI.Drawer>
			</div>
		);
	}
}

