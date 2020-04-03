import * as helpers from '%{ cb "/js/helpers.js" }%';

import GameList from '%{ cb "/js/game_list.js" }%';
import CreateGameDialog from '%{ cb "/js/create_game_dialog.js" }%';

export default class Start extends React.Component {
	constructor(props) {
		super(props);
		this.state = { newGameFormOpen: false };
		this.stagingGamesList = null;
	}
	render() {
		return (
			<React.Fragment>
				<div
					style={{
						height: "calc(100% - 120px)",
						overflowY: "scroll"
					}}
				>
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
										url={
											this.props.urls["my-started-games"]
										}
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
										url={
											this.props.urls["my-staging-games"]
										}
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
										url={
											this.props.urls["my-finished-games"]
										}
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
								key="new-game"
								onClick={_ => {
									this.setState({
										newGameFormOpen: !this.state
											.newGameFormOpen
									});
								}}
								variant="outlined"
								color="secondary"
							>
								New game
								{this.state.newGameFormOpen
									? helpers.createIcon("\ue5cf")
									: ""}
							</MaterialUI.Button>
						</MaterialUI.Toolbar>
						<MaterialUI.Slide
							mountOnEnter
							unmountOnExit
							direction="up"
							in={this.state.newGameFormOpen}
						>
							<MaterialUI.Toolbar
								style={{ flexDirection: "column" }}
							>
								<MaterialUI.Button
									style={{ margin: 4 }}
									variant="outlined"
									color="secondary"
									key="find-open"
									onClick={this.props.findOpenGame}
								>
									Find open game
								</MaterialUI.Button>
								<MaterialUI.Button
									style={{ margin: 4 }}
									variant="outlined"
									color="secondary"
									key="find-private"
									onClick={this.props.findPrivateGame}
								>
									Find private game
								</MaterialUI.Button>
								<MaterialUI.Button
									style={{ margin: 4 }}
									variant="outlined"
									color="secondary"
									key="create"
									onClick={_ => {
										this.createGameDialog.setState({
											open: true
										});
									}}
								>
									Create game
								</MaterialUI.Button>
							</MaterialUI.Toolbar>
						</MaterialUI.Slide>
					</MaterialUI.AppBar>
					<CreateGameDialog
						gameCreated={this.props.myStagingGames}
						parentCB={c => {
							this.createGameDialog = c;
						}}
					/>
				</div>
			</React.Fragment>
		);
	}
}
