import GameList from '%{ cb "/js/game_list.js" }%';

import NewGame from '%{ cb "/js/new_game.js" }%';

export default class Start extends React.Component {
	constructor(props) {
		super(props);
		this.state = { newGameFormOpen: false };
	}
	render() {
		return (
			<React.Fragment>
				<MaterialUI.List>
					<MaterialUI.ListItem>
						<MaterialUI.ListItemText primary="NEWS: Diplicity has a new React-based UI." />
					</MaterialUI.ListItem>
					<li key="started">
						<ul style={{ paddingInlineStart: 0 }}>
							<MaterialUI.ListSubheader color="primary">
								My ongoing games
							</MaterialUI.ListSubheader>
							<MaterialUI.ListItem>
								<GameList
									expansionPanelWrapped={true}
									url={this.props.urls["my-started-games"]}
									limit={8}
									skipMore={true}
								/>
							</MaterialUI.ListItem>
						</ul>
					</li>
					<li key="staging">
						<ul style={{ paddingInlineStart: 0 }}>
							<MaterialUI.ListSubheader color="primary">
								My forming games
							</MaterialUI.ListSubheader>
							<MaterialUI.ListItem>
								<GameList
									expansionPanelWrapped={true}
									url={this.props.urls["my-staging-games"]}
									limit={8}
									skipMore={true}
								/>
							</MaterialUI.ListItem>
						</ul>
					</li>
					<li key="finished">
						<ul style={{ paddingInlineStart: 0 }}>
							<MaterialUI.ListSubheader color="primary">
								My finished games
							</MaterialUI.ListSubheader>
							<MaterialUI.ListItem>
								<GameList
									expansionPanelWrapped={true}
									url={this.props.urls["my-finished-games"]}
									limit={8}
									skipMore={true}
								/>
							</MaterialUI.ListItem>
						</ul>
					</li>
				</MaterialUI.List>
				<MaterialUI.AppBar
					position="fixed"
					color="primary"
					style={{ top: "auto", bottom: 0 }}
				>
					<MaterialUI.Toolbar
						style={{ justifyContent: "space-around" }}
					>
						<MaterialUI.Button
							onClick={_ => {
								this.setState({ newGameFormOpen: true });
							}}
							variant="outlined"
							color="secondary"
						>
							New game
						</MaterialUI.Button>
					</MaterialUI.Toolbar>
				</MaterialUI.AppBar>
				<MaterialUI.Drawer
					anchor="bottom"
					open={this.state.newGameFormOpen}
				>
					<MaterialUI.ClickAwayListener
						onClickAway={_ => {
							this.setState({ newGameFormOpen: false });
						}}
					>
						<NewGame
							findPrivateGame={this.props.findPrivateGame}
							findOpenGame={this.props.findOpenGame}
						/>
					</MaterialUI.ClickAwayListener>
				</MaterialUI.Drawer>
			</React.Fragment>
		);
	}
}
