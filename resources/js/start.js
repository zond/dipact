import * as helpers from '%{ cb "/js/helpers.js" }%';

import GameList from '%{ cb "/js/game_list.js" }%';
import CreateGameDialog from '%{ cb "/js/create_game_dialog.js" }%';

export default class Start extends React.Component {
	constructor(props) {
		super(props);
		this.state = { newGameFormOpen: false };
		this.createGameDialog = null;
		this.myStagingGamesList = null;
		this.myStartedGamesList = null;
		this.myFinishedGamesList = null;
	}
	componentDidMount() {
		gtag("set", { page_title: "Start", page_location: location.href });
		gtag("event", "page_view");
	}
	render() {
		return (
			<React.Fragment>
				{Globals.userStats.Properties.JoinedGames ? (
					<div
						className={helpers.scopedClass(
							"height: calc(100% - 114px); overflow-y: scroll;"
						)}
					>
						<MaterialUI.List>
							<li key="started" id="my-started-container">
								<ul style={{ paddingInlineStart: 0 }}>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											paddingRight: "8px"
										}}
									>
										<MaterialUI.ListSubheader
											style={{
												backgroundColor: "white",
												zIndex: "2",
												marginBottom: "2px",
												height: "44px",
												color: "rgba(40, 26, 26, 0.56)"
											}}
										>
											My ongoing games
										</MaterialUI.ListSubheader>
									</div>
									<MaterialUI.ListItem
										style={{
											padding: "0px 16px 4px 16px",
											width: "100%"
										}}
									>
										<GameList
											limit={128}
											contained={true}
											url={
												this.props.urls[
													"my-started-games"
												]
											}
											onPhaseMessage={_ => {
												this.myStartedGamesList.reload();
												this.myFinishedGamesList.reload();
											}}
											parentCB={c => {
												this.myStartedGamesList = c;
											}}
											onFilled={_ => {
												document.getElementById(
													"my-started-container"
												).style.display = "block";
											}}
											onEmpty={_ => {
												document.getElementById(
													"my-started-container"
												).style.display = "none";
											}}
										/>
									</MaterialUI.ListItem>
								</ul>
							</li>
							<li key="staging" id="my-staging-container">
								<ul style={{ paddingInlineStart: 0 }}>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											paddingRight: "8px"
										}}
									>
										<MaterialUI.ListSubheader
											style={{
												backgroundColor: "white",
												zIndex: "2",
												marginBottom: "2px",
												height: "44px",
												color: "rgba(40, 26, 26, 0.56)"
											}}
										>
											My forming games
										</MaterialUI.ListSubheader>
									</div>

									<MaterialUI.ListItem
										style={{
											padding: "0px 16px 4px 16px"
										}}
									>
										<GameList
											limit={128}
											contained={true}
											onPhaseMessage={_ => {
												this.myStartedGamesList.reload();
												this.myStagingGamesList.reload();
											}}
											onFilled={_ => {
												document.getElementById(
													"my-staging-container"
												).style.display = "block";
											}}
											withDetails={true}
											onEmpty={_ => {
												document.getElementById(
													"my-staging-container"
												).style.display = "none";
											}}
											parentCB={c => {
												this.myStagingGamesList = c;
											}}
											url={
												this.props.urls[
													"my-staging-games"
												]
											}
										/>
									</MaterialUI.ListItem>
								</ul>
							</li>
							<li key="finished" id="my-finished-container">
								<ul style={{ paddingInlineStart: 0 }}>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											paddingRight: "8px"
										}}
									>
										<MaterialUI.ListSubheader
											style={{
												backgroundColor: "white",
												zIndex: "2",
												marginBottom: "2px",
												height: "44px",
												color: "rgba(40, 26, 26, 0.56)"
											}}
										>
											My finished games
										</MaterialUI.ListSubheader>
										<MaterialUI.Button
											onClick={
												this.props.renderMyFinishedGames
											}
										>
											View all
										</MaterialUI.Button>
									</div>

									<MaterialUI.ListItem
										style={{
											padding: "0px 16px 4px 16px"
										}}
									>
										<GameList
											contained={true}
											parentCB={c => {
												this.myFinishedGamesList = c;
											}}
											onFilled={_ => {
												document.getElementById(
													"my-finished-container"
												).style.display = "block";
											}}
											onEmpty={_ => {
												document.getElementById(
													"my-finished-container"
												).style.display = "none";
											}}
											url={
												this.props.urls[
													"my-finished-games"
												]
											}
											limit={8}
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
									variant="contained"
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
										List open games
									</MaterialUI.Button>
									<MaterialUI.Button
										style={{ margin: 4 }}
										variant="outlined"
										color="secondary"
										key="find-private"
										onClick={this.props.findPrivateGame}
									>
										Find game
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
					</div>
				) : (
					<React.Fragment>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								height: "calc(100% - 54px)",
								overflowY: "scroll",
								backgroundColor: "#FDE2B5"
							}}
						>
							<div
								id="top"
								style={{
									margin: "auto",
									width: "100%",
									maxWidth: "400px",
									alignSelf: "center",
									display: "flex",
									flexDirection: "column"
								}}
							>
								<img
									className={helpers.scopedClass(`
                  width: calc(100% - 48px);
                  max-width: 340px;
                  margin: 24px;
                  
                  `)}
									src="../static/img/logo_dark.svg"
								/>

								<MaterialUI.Typography
									variant="body2"
									style={{
										margin: "0px 16px 0px 16px"
									}}
								>
									Welcome! Diplomacy games are all about human
									interaction, so they usually take or even
									start after many days. Before joining your
									first game, we strongly advise you to read
									the rules.
								</MaterialUI.Typography>
								<MaterialUI.Button
									style={{
										margin: "16px auto",
										minWidth: "200px"
									}}
									color="primary"
									variant="outlined"
									key="find-open"
									href="https://en.wikibooks.org/wiki/Diplomacy/Rules"
									target="_blank"
								>
									Read the rules
								</MaterialUI.Button>
							</div>
							<div id="bottom">
								<div
									style={{
										backgroundImage:
											"url('../static/img/soldiers.svg'",
										height: "72px"
									}}
								></div>
								<div
									style={{
										backgroundColor: "#291B1B",
										display: "flex",
										flexDirection: "column",
										paddingBottom: "24px"
									}}
								>
									<MaterialUI.Button
										style={{
											margin: "4px auto",
											minWidth: "200px"
										}}
										variant="outlined"
										color="secondary"
										key="find-open"
										onClick={this.props.findOpenGame}
									>
										Find open game
									</MaterialUI.Button>
									<MaterialUI.Button
										style={{
											margin: "4px auto",
											minWidth: "200px"
										}}
										variant="outlined"
										color="secondary"
										key="find-private"
										onClick={this.props.findPrivateGame}
									>
										Find private game
									</MaterialUI.Button>
									<MaterialUI.Button
										style={{
											margin: "4px auto",
											minWidth: "200px"
										}}
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
								</div>
							</div>
						</div>
					</React.Fragment>
				)}
				<CreateGameDialog
					gameCreated={_ => {
						this.myStagingGamesList.reload();
					}}
					parentCB={c => {
						this.createGameDialog = c;
					}}
				/>
			</React.Fragment>
		);
	}
}
