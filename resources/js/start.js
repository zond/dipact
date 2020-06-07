import * as helpers from '%{ cb "/js/helpers.js" }%';

import GameList from '%{ cb "/js/game_list.js" }%';
import CreateGameDialog from '%{ cb "/js/create_game_dialog.js" }%';

const latestNews = 1;
const latestNewsShownKey = "latestNewsShownKey";

export default class Start extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			newGameFormOpen: false,
			newsDialogOpen:
				!localStorage.getItem(latestNewsShownKey) ||
				Number.parseInt(localStorage.getItem(latestNewsShownKey)) <
					latestNews
		};
		this.createGameDialog = null;
		this.myStagingGamesList = null;
		this.myStartedGamesList = null;
		this.myFinishedGamesList = null;
		this.newsDialog = this.newsDialog.bind(this);
		localStorage.setItem(latestNewsShownKey, "" + latestNews);
	}
	componentDidMount() {
		gtag("set", { page_title: "Start", page_location: location.href });
		gtag("event", "page_view");
	}
	newsDialog() {
		return (
			<React.Fragment>
				<MaterialUI.Dialog
					open={this.state.newsDialogOpen}
					fullScreen
					onClose={_ => {
						this.setState({ newsDialogOpen: false });
					}}
				>
					<MaterialUI.AppBar>
						<MaterialUI.Toolbar>
							<MaterialUI.IconButton
								edge="start"
								color="inherit"
								onClick={_ => {
									this.setState({ newsDialogOpen: false });
								}}
								aria-label="close"
							>
								{helpers.createIcon("\ue5cd")}
							</MaterialUI.IconButton>
							<MaterialUI.Typography
								variant="h6"
								style={{ paddingLeft: "16px" }}
							>
								Beta center
							</MaterialUI.Typography>
						</MaterialUI.Toolbar>
					</MaterialUI.AppBar>
					<div
						style={{
							height: "100%",
							padding: "0x",
							margin: "0px",
							maxWidth: "940px",
							marginLeft: "auto",
							marginRight: "auto"
						}}
					>
						<div
							style={{
								padding: "16px",
								marginTop: "56px",
								height: "calc(100% - 158px)"
							}}
						>
							<MaterialUI.Typography variant="h6" style={{}}>
								Welcome to the new Diplicity!
							</MaterialUI.Typography>
							<MaterialUI.Typography variant="body2">
								We redesigned our app and started using the new
								version, which is still in Beta. This means
								there may be some (small) bugs that we haven't
								found on our own.
								<br /> If you encounter an issue, please let us
								know and we'll try to fix it ASAP.
								<br />
								<br />
								Thanks!
							</MaterialUI.Typography>

							<div
								style={{
									marginTop: "32px",
									display: "flex",
									justifyContent: "space-evenly"
								}}
							>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center"
									}}
								>
									{helpers.createIcon("\ue0b7")}

									<MaterialUI.Typography variant="caption">
										<a href="https://groups.google.com/forum/#!forum/diplicity-talk">
											Give feedback
										</a>
									</MaterialUI.Typography>
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center"
									}}
								>
									{helpers.createIcon("\ue868")}
									<MaterialUI.Typography variant="caption">
										<a href="mailto:diplicity-talk@googlegroups.com">
											Report a bug
										</a>{" "}
									</MaterialUI.Typography>
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center"
									}}
								>
									{helpers.createIcon("\ue889")}
									<MaterialUI.Typography variant="caption">
										<a href="https://sites.google.com/view/diplicity/home/documentation/install-the-old-apk">
											Install old app
										</a>
									</MaterialUI.Typography>
								</div>
							</div>

							<div
								style={{
									marginTop: "32px",
									textAlign: "center"
								}}
							>
								<MaterialUI.Button
									variant="contained"
									color="primary"
									onClick={_ => {
										this.setState({
											newsDialogOpen: false
										});
									}}
								>
									Show me the new app
								</MaterialUI.Button>
							</div>
						</div>
						<div
							style={{
								backgroundImage:
									"url('../static/img/soldiers.svg'",
								height: "72px",
								top: "auto",
								bottom: "0px"
							}}
						></div>
					</div>
				</MaterialUI.Dialog>
			</React.Fragment>
		);
	}
	render() {
		return (
			<React.Fragment>
				{this.newsDialog()}
				{Globals.userStats.Properties.JoinedGames ? (
					<div
						className={helpers.scopedClass(
							"height: calc(100% - 114px); overflow-y: scroll;"
						)}
					>
						{this.state.newsDialogOpen ? (
							""
						) : (
							<div
								style={{
									minwidth: "150px",
									borderRadius: "3px",
									display: "flex",
									alignItems: "flex-start",
									padding: "6px 8px",
									margin: "8px 16px 0px 16px",
									backgroundColor: "rgb(255, 244, 229)"
								}}
								onClick={_ => {
									this.setState({ newsDialogOpen: true });
								}}
							>
								<div
									style={{
										padding: "5px",
										marginRight: "8px",
										color: "rgb(255, 152, 0)"
									}}
								>
									{helpers.createIcon("\ue002")}
								</div>

								<div
									style={{
										display: "flex",
										flexDirection: "column"
									}}
								>
									<MaterialUI.Typography
										variant="body1"
										style={{
											color: "rgb(97, 26, 21)",
											fontWeight: "500"
										}}
									>
										This app is in beta state
									</MaterialUI.Typography>

									<MaterialUI.Typography
										variant="body2"
										style={{ color: "rgb(97, 26, 21)" }}
									>
										For more info or to report a bug, touch
										here
									</MaterialUI.Typography>
								</div>
							</div>
						)}
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
												this.myStartedGamesList.loadPropsURL();
												this.myFinishedGamesList.loadPropsURL();
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
											padding: "0px 16px"
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
										Browse open games
									</MaterialUI.Button>
									<MaterialUI.Button
										style={{ margin: 4 }}
										variant="outlined"
										color="secondary"
										key="find-private"
										onClick={this.props.findPrivateGame}
									>
										Find game by ID
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
										Browse open games
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
										Find game by ID
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
