import * as helpers from '%{ cb "/js/helpers.js" }%';

import Game from '%{ cb "/js/game.js" }%';
import NationPreferencesDialog from '%{ cb "/js/nation_preferences_dialog.js" }%';

export default class GameListElement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			game: this.props.game,
			viewOpen: false,
			member: props.game.Properties.Members.find(e => {
				return e.User.Email == Globals.user.Email;
			})
		};
		this.variant = Globals.variants.find(v => {
			return v.Properties.Name == this.props.game.Properties.Variant;
		});
		this.nationPreferencesDialog = null;
		this.valignClass = helpers.scopedClass(
			"display: flex; align-items: center;"
		);
		this.viewGame = this.viewGame.bind(this);
		this.closeGame = this.closeGame.bind(this);
		this.joinGame = this.joinGame.bind(this);
		this.leaveGame = this.leaveGame.bind(this);
		this.joinGameWithPreferences = this.joinGameWithPreferences.bind(this);
		this.reloadGame = this.reloadGame.bind(this);
		this.phaseMessageHandler = this.phaseMessageHandler.bind(this);
		this.messageHandler = this.messageHandler.bind(this);
		this.dead = false;
	}
	messageHandler(payload) {
		if (payload.data.message.GameID != this.props.game.Properties.ID) {
			return false;
		}
		this.reloadGame();
		return false;
	}
	phaseMessageHandler(payload) {
		if (payload.data.gameID != this.state.game.Properties.ID) {
			return false;
		}
		this.reloadGame();
		return false;
	}
	componentWillUnmount() {
		Globals.messaging.unsubscribe("phase", this.phaseMessageHandler);
		Globals.messaging.unsubscribe("message", this.messageHandler);
	}
	componentDidMount() {
		Globals.messaging.subscribe("phase", this.phaseMessageHandler);
		Globals.messaging.subscribe("message", this.messageHandler);
	}
	joinGameWithPreferences(link, preferences) {
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest(link.URL, {
					method: link.Method,
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						NationPreferences: preferences.join(",")
					})
				})
			)
			.then(_ => {
				helpers.decProgress();
				Globals.messaging.start();
				this.reloadGame();
			});
	}
	reloadGame() {
		helpers
			.safeFetch(
				helpers.createRequest(
					this.state.game.Links.find(l => {
						return l.Rel == "self";
					}).URL
				)
			)
			.then(resp => resp.json())
			.then(js => {
				this.setState({
					game: js,
					member: js.Properties.Members.find(e => {
						return e.User.Email == Globals.user.Email;
					})
				});
			});
	}
	leaveGame(link) {
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest(link.URL, {
					method: link.Method
				})
			)
			.then(resp => resp.json())
			.then(_ => {
				helpers.decProgress();
				if (this.state.game.Properties.Members.length > 1) {
					this.reloadGame();
				} else {
					this.dead = true;
					this.setState((state, props) => {
						state = Object.assign({}, state);
						state.game.Links = [];
						return state;
					});
				}
			});
	}
	joinGame(link) {
		if (this.state.game.Properties.NationAllocation == 1) {
			this.nationPreferencesDialog.setState({
				open: true,
				nations: this.variant.Properties.Nations,
				onSelected: preferences => {
					this.joinGameWithPreferences(link, preferences);
				}
			});
		} else {
			this.joinGameWithPreferences(link, []);
		}
	}
	closeGame() {
		this.setState({ viewOpen: false });
	}
	viewGame(e) {
		e.stopPropagation();
		e.preventDefault();
		this.setState({ viewOpen: true });
	}
	addIcon(ary, codepoint, color) {
		ary.push(
			helpers.createIcon(codepoint, {
				padding: "4px 1px 0px 1px",
				color: color,
				fontSize: "14px"
			})
		);
	}
	getIcons() {
		let icons = [];
    if (
      this.state.game.Properties.MinQuickness ||
      this.state.game.Properties.MinReliability
    ) {
      this.addIcon(icons, "\ue425", "black");
    }
    if (
      this.state.game.Properties.MinRating ||
      this.state.game.Properties.MaxRating
    ) {
      this.addIcon(icons, "\ue83a", "black");
    }
    if (
      this.state.game.Properties.MaxHater ||
      this.state.game.Properties.MaxHated
    ) {
      icons.push(
      	<MaterialUI.Tooltip disableFocusListener title="Maximum hate requirement">
      	<MaterialUI.SvgIcon style={{"height":"16px", "width":"16px"}}>
      	<g id="Artboard" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="emoticon-angry-outline" transform="translate(2.000000, 2.000000)" fill="#000000" fillRule="nonzero">
            <path d="M1.499,0.115 L19.2847763,17.8994949 L19.299,17.885 L19.8994949,18.4852814 L18.4852814,19.8994949 L16.3286725,17.7426435 C14.5506593,19.1960497 12.3167744,20 10,20 C7.3478351,20 4.80429597,18.9464316 2.92893219,17.0710678 C1.0535684,15.195704 0,12.6521649 0,10 C0,7.59864107 0.846427847,5.39497595 2.25721107,3.67107713 L0.100505063,1.51471863 L1.499,0.115 Z M3.68005389,5.09447025 C2.62704639,6.44913544 2,8.15134045 2,10 C2,14.418278 5.581722,18 10,18 C11.8486595,18 13.5508646,17.3729536 14.9055298,16.3199461 L13.293,14.707 L12.77,15.23 C12.32,14.5 11.25,14 10,14 C8.75,14 7.68,14.5 7.23,15.23 L5.81,13.81 C6.71,12.72 8.25,12 10,12 C10.2091413,12 10.4152832,12.0102834 10.6176919,12.0302527 L7.32314129,8.73840737 C7.08353442,8.90238797 6.7987395,9 6.5,9 C5.7,9 5,8.3 5,7.5 L5,6.414 L3.68005389,5.09447025 Z M10,0 C12.6521649,0 15.195704,1.0535684 17.0710678,2.92893219 C18.9464316,4.80429597 20,7.3478351 20,10 C20,11.6325537 19.6007944,13.2239482 18.8564416,14.6436748 L17.3584074,13.144315 C17.7713793,12.1791202 18,11.1162587 18,10 C18,7.87826808 17.1571453,5.84343678 15.6568542,4.34314575 C14.1565632,2.84285472 12.1217319,2 10,2 C8.88374129,2 7.82087979,2.22862069 6.85568497,2.64159261 L5.35539972,1.1417664 C6.74323813,0.41258719 8.32343661,0 10,0 Z M15,6 L15,7.5 C15,8.3 14.3,9 13.5,9 C12.7,9 12,8.3 12,7.5 L15,6 Z" id="Combined-Shape"></path>
        </g>
    </g>
    </MaterialUI.SvgIcon>
    </MaterialUI.Tooltip>
      	);
    }
    if (
      this.state.game.Properties.DisableConferenceChat ||
      this.state.game.Properties.DisableGroupChat ||
      this.state.game.Properties.DisablePrivateChat
    ) {
      icons.push(
        <MaterialUI.Tooltip disableFocusListener title="Chat disabled">
          <MaterialUI.SvgIcon style={{"height":"16px", "width":"16px"}}>
            <g
              id="Artboard"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g id="message-24px">
                <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                <path
                  d="M20,2 L4,2 C2.9,2 2.01,2.9 2.01,4 L2,22 L6,18 L20,18 C21.1,18 22,17.1 22,16 L22,4 C22,2.9 21.1,2 20,2 Z M18,14 L6,14 L6,12 L18,12 L18,14 Z M18,11 L6,11 L6,9 L18,9 L18,11 Z M18,8 L6,8 L6,6 L18,6 L18,8 Z"
                  id="Shape"
                  fill="#000000"
                  fillRule="nonzero"
                ></path>
              </g>
              <rect
                id="Rectangle"
                fill="#000000"
                transform="translate(10.899495, 12.498990) rotate(45.000000) translate(-10.899495, -12.498990) "
                x="-2.10050506"
                y="11.4989899"
                width="26"
                height="2"
              ></rect>
              <rect
                id="Rectangle"
                fill="#FFFFFF"
                transform="translate(12.099495, 10.899495) rotate(45.000000) translate(-12.099495, -10.899495) "
                x="-0.900505063"
                y="9.89949494"
                width="26"
                height="2"
              ></rect>
            </g>
          </MaterialUI.SvgIcon>
        </MaterialUI.Tooltip>
      );
    }
    if (this.state.game.Properties.Private) {
      this.addIcon(icons, "\ue897", "black");
    }
    if (this.state.game.Properties.NationAllocation == 1) {
      this.addIcon(icons, "\ue065", "black");
    }
		return <MaterialUI.Box display="inline">{icons}</MaterialUI.Box>;
	}
	render() {
		let expandedGameCells = [
			"Created at",
			helpers.timeStrToDate(this.state.game.Properties.CreatedAt)
		];
		if (this.state.game.Properties.Started) {
			expandedGameCells.push(
				"Started at",
				helpers.timeStrToDate(this.state.game.Properties.StartedAt)
			);
		}
		if (this.state.game.Properties.Finished) {
			expandedGameCells.push(
				"Finished at",
				helpers.timeStrToDate(this.state.game.Properties.FinishedAt)
			);
		}
		expandedGameCells.push(
			"Nation allocation",
			this.state.game.Properties.NationAllocation == 1
				? "Preferences"
				: "Random"
		);

		if (this.state.game.Properties.MinRating) {
			expandedGameCells.push(
				"Minimum rating",
				this.state.game.Properties.MinRating
			);
		}
		if (this.state.game.Properties.MaxRating) {
			expandedGameCells.push(
				"Maximum rating",
				this.state.game.Properties.MaxRating
			);
		}
		if (this.state.game.Properties.MinReliability) {
			expandedGameCells.push(
				"Minimum reliability",
				this.state.game.Properties.MinReliability
			);
		}
		if (this.state.game.Properties.MinQuickness) {
			expandedGameCells.push(
				"Minimum quickness",
				this.state.game.Properties.MinQuickness
			);
		}
		if (this.state.game.Properties.MaxHated) {
			expandedGameCells.push(
				"Maximum hated",
				this.state.game.Properties.MaxHated
			);
		}
		if (this.state.game.Properties.MaxHater) {
			expandedGameCells.push(
				"Maximum hater",
				this.state.game.Properties.MaxHater
			);
		}
		if (
			this.state.game.Properties.DisableConferenceChat ||
			this.state.game.Properties.DisableGroupChat ||
			this.state.game.Properties.DisablePrivateChat
		) {
			if (
				this.state.game.Properties.DisableConferenceChat &&
				this.state.game.Properties.DisableGroupChat &&
				this.state.game.Properties.DisablePrivateChat
			) {
				// Add two columns because this is required for formatting nicely.
				expandedGameCells.push("All chat disabled", "(Gunboat)");
			} else {
				// Sort channel types by whether they're enabled or disabled.
				let allChannels = { false: [], true: [] };
				allChannels[
					this.state.game.Properties.DisableConferenceChat
				].push("Conference");
				allChannels[this.state.game.Properties.DisableGroupChat].push(
					"Group"
				);
				allChannels[this.state.game.Properties.DisablePrivateChat].push(
					"Private"
				);
				expandedGameCells.push(
					"Disabled channels",
					allChannels[false].join(",")
				);
				expandedGameCells.push(
					"Enabled channels",
					allChannels[true].join(",")
				);
			}
		}
		let expandedGameItems = [];
		let itemKey = 0;
		expandedGameCells.forEach(cell =>
			expandedGameItems.push(
				<MaterialUI.Grid item key={itemKey++} xs={6}>
					<MaterialUI.Typography>{cell}</MaterialUI.Typography>
				</MaterialUI.Grid>
			)
		);
		this.state.game.Properties.Members.forEach(member => {
			expandedGameItems.push(
				<MaterialUI.Grid item key={itemKey++} xs={2}>
					<MaterialUI.Avatar
						className={helpers.avatarClass}
						alt={member.User.Name}
						src={member.User.Picture}
					/>
				</MaterialUI.Grid>
			);
			expandedGameItems.push(
				<MaterialUI.Grid
					className={this.valignClass}
					item
					key={itemKey++}
					xs={10}
				>
					<MaterialUI.Typography>
						{member.User.GivenName} {member.User.FamilyName}
					</MaterialUI.Typography>
				</MaterialUI.Grid>
			);
		});
		let buttons = [];
		if (!this.dead) {
			buttons.push(
				<MaterialUI.Button onClick={this.viewGame} key={itemKey++}>
					View
				</MaterialUI.Button>
			);
		}
		this.state.game.Links.forEach(link => {
			if (link.Rel == "join") {
				buttons.push(
					<MaterialUI.Button
						key={itemKey++}
						onClick={_ => {
							this.joinGame(link);
						}}
					>
						Join
					</MaterialUI.Button>
				);
			} else if (link.Rel == "leave") {
				buttons.push(
					<MaterialUI.Button
						key={itemKey++}
						onClick={_ => {
							this.leaveGame(link);
						}}
					>
						Leave
					</MaterialUI.Button>
				);
			}
		});
		expandedGameItems.push(
			<MaterialUI.Grid item key={itemKey++} xs={12}>
				<MaterialUI.ButtonGroup style={{ marginTop: "0.2em" }}>
					{buttons}
				</MaterialUI.ButtonGroup>
			</MaterialUI.Grid>
		);

		let summary = (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					width: "100%",

					marginTop: "8px"
				}}
			>
				{(_ => {
					if (this.state.game.Properties.Started) {
						return (
							<React.Fragment>
								{/* IF STARTED */}
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between"
									}}
								>
									{this.state.member &&
									this.state.member.UnreadMessages > 0 ? (
										<MaterialUI.Badge
											key={itemKey++}
											badgeContent={
												this.state.member.UnreadMessages
											}
											color="primary"
											style={{
												maxWidth: "calc(100% - 70px)"
											}}
										>
											<MaterialUI.Typography
												textroverflow="ellipsis"
												noWrap
												style={{
													color: "rgba(40, 26, 26, 1)"
												}}
											>
												{helpers.gameDesc(
													this.state.game
												)}
											</MaterialUI.Typography>
										</MaterialUI.Badge>
									) : (
										<MaterialUI.Typography
											key={itemKey++}
											textroverflow="ellipsis"
											noWrap={true}
											style={{
												minWidth: "60px",
												color: "rgba(40, 26, 26, 1)"
											}}
										>
											{helpers.gameDesc(this.state.game)}
										</MaterialUI.Typography>
									)}

									<div
										id="Timer"
										key={itemKey++}
										style={{
											alignSelf: "center",
											display: "flex",
											alignItems: "center",
											color: "#281A1A"
										}}
									>
										{this.state.member != null &&
										this.state.game.Properties.Started &&
										!this.state.game.Properties.Finished ? (
											this.state.member.NewestPhaseState
												.OnProbation ? (
												<MaterialUI.SvgIcon>
													<path
														d="M2.98188996,2.24133335 L21.3666663,20.6261097 L20.0261097,21.9666663 L19.0573333,20.998 L19,21 L5,21 C3.95,21 3.0822314,20.1799587 3.00551277,19.1486946 L3,19 L3,5 L3.00233335,4.942 L1.64133335,3.58188996 L2.98188996,2.24133335 Z M12,1 C13.235,1 14.2895,1.7581 14.75196,2.828465 L14.82,3 L19,3 C20.05,3 20.9177686,3.82004132 20.9944872,4.85130541 L21,5 L21,17.963 L16.037,13 L17,13 L17,11 L14.037,11 L12.037,9 L17,9 L17,7 L10.037,7 L6.037,3 L9.18,3 C9.579,1.898 10.5917,1.0848 11.80656,1.006235 L12,1 Z M13.0593333,15 L7,15 L7,17 L15.0593333,17 L13.0593333,15 Z M11.0593333,13 L9.06033335,11 L7,11 L7,13 L11.0593333,13 Z M12,3 C11.45,3 11,3.45 11,4 C11,4.55 11.45,5 12,5 C12.55,5 13,4.55 13,4 C13,3.45 12.55,3 12,3 Z"
														id="Shape"
														fill="#b71c1c"
														fill-rule="nonzero"
													></path>
												</MaterialUI.SvgIcon>
											) : this.state.member
													.NewestPhaseState
													.ReadyToResolve ? (
												<MaterialUI.SvgIcon>
													<path
														d="M9,0 C10.3,0 11.4,0.84 11.82,2 L11.82,2 L16,2 C17.1045695,2 18,2.8954305 18,4 L18,4 L18,18 C18,19.1045695 17.1045695,20 16,20 L16,20 L2,20 C0.8954305,20 0,19.1045695 0,18 L0,18 L0,4 C0,2.8954305 0.8954305,2 2,2 L2,2 L6.18,2 C6.6,0.84 7.7,0 9,0 Z M13.4347826,7 L7.70608696,12.7391304 L4.56521739,9.60869565 L3,11.173913 L7.70608696,15.8695652 L15,8.56521739 L13.4347826,7 Z M9,2 C8.44771525,2 8,2.44771525 8,3 C8,3.55228475 8.44771525,4 9,4 C9.55228475,4 10,3.55228475 10,3 C10,2.44771525 9.55228475,2 9,2 Z"
														fill="#281A1A"
														id="Combined-Shape"
													></path>
												</MaterialUI.SvgIcon>
											) : (
												helpers.createIcon("\ue422")
											)
										) : (
											""
										)}
										<MaterialUI.Typography
											variant="body2"
											style={{
												paddingLeft: "2px",
												color: "rgba(40, 26, 26, 1)"
											}}
										>
											{this.state.game.Properties.Finished
												? helpers.minutesToDuration(
														-this.state.game
															.Properties
															.FinishedAgo /
															1000000000 /
															60,
														true
												  )
												: helpers.minutesToDuration(
														this.state.game
															.Properties
															.NewestPhaseMeta[0]
															.NextDeadlineIn /
															1000000000 /
															60,
														true
												  )}
										</MaterialUI.Typography>
									</div>
								</div>
								<div
									key={itemKey++}
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between",
										flexWrap: "wrap"
									}}
								>
									<MaterialUI.Typography
										textroverflow="ellipsis"
										noWrap={true}
										display="inline"
										variant="caption"
										id="variant"
										style={{
											color: "rgba(40, 26, 26, 0.7)"
										}}
									>
										{this.state.game.Properties.Variant}{" "}
										{helpers.minutesToDuration(
											this.state.game.Properties
												.PhaseLengthMinutes
										)}
									</MaterialUI.Typography>
									<MaterialUI.Typography
										variant="caption"
										style={{
											color: "rgba(40, 26, 26, 0.7)"
										}}
									>
										{
											this.state.game.Properties
												.NewestPhaseMeta[0].Season
										}{" "}
										{
											this.state.game.Properties
												.NewestPhaseMeta[0].Year
										}
										,{" "}
										{
											this.state.game.Properties
												.NewestPhaseMeta[0].Type
										}
									</MaterialUI.Typography>
								</div>
							</React.Fragment>
						);
					} else {
						return (
							<React.Fragment>
								{/* IF STARTED */}
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between"
									}}
								>
									<MaterialUI.Typography
										key={itemKey++}
										textroverflow="ellipsis"
										noWrap={true}
										style={{}}
									>
										{helpers.gameDesc(this.state.game)}
									</MaterialUI.Typography>

									<div
										id="Join"
										key={itemKey++}
										style={{
											alignSelf: "center",
											display: "flex",
											alignItems: "center"
										}}
									>
										{helpers.createIcon("\ue7fb")}{" "}
										<MaterialUI.Typography
											variant="body2"
											style={{ paddingLeft: "2px" }}
										>
											{
												this.state.game.Properties
													.NMembers
											}
											/
											{
												this.variant.Properties.Nations
													.length
											}{" "}
										</MaterialUI.Typography>
									</div>
								</div>
								<div style={{display: "flex",
										flexDirection: "row",
										justifyContent: "space-between"}} >
								<MaterialUI.Typography
									textroverflow="ellipsis"
									noWrap={true}
									display="inline"
									variant="caption"
									style={{ color: "rgba(40, 26, 26, 0.7)" }}
								>
									{this.state.game.Properties.Variant}{" "}
									{helpers.minutesToDuration(
										this.state.game.Properties
											.PhaseLengthMinutes
									)}
								</MaterialUI.Typography>
								<div> {this.getIcons()}</div>
								</div>
							</React.Fragment>
						);
					}
				})()}

				 <div>
          </div> 
			</div>
		);

		let gameView = (
			<MaterialUI.Zoom
				in={this.state.viewOpen}
				mountOnEnter
				unmountOnExit
			>
				<div
					style={{
						position: "fixed",
						zIndex: 1300,
						right: 0,
						bottom: 0,
						top: 0,
						left: 0,
						background: "#ffffff"
					}}
				>
					<Game
						unreadMessagesUpdate={this.reloadGame}
						gamePromise={
							new Promise((res, rej) => {
								res(this.state.game);
							})
						}
						close={this.closeGame}
					/>
				</div>
			</MaterialUI.Zoom>
		);

		if (this.props.summaryOnly) {
			return (
				<React.Fragment>
					<div style={{ width: "100%" }} onClick={this.viewGame}>
						{summary}
					</div>
					{gameView}
				</React.Fragment>
			);
		}
		return (
			<React.Fragment>
				<MaterialUI.ExpansionPanel key="game-details">
					{/* TODO: @Joren, the next iteration is here: styling the the expansionpanel on "My ..." list */}
					<MaterialUI.ExpansionPanelSummary
						classes={{
							content: helpers.scopedClass("min-width: 0;")
						}}
						expandIcon={helpers.createIcon("\ue5cf")}
					>
						{summary}
					</MaterialUI.ExpansionPanelSummary>
					<MaterialUI.ExpansionPanelDetails
						style={{
							paddingRight: "0.3em",
							paddingLeft: "0.3em"
						}}
					>
						<MaterialUI.Paper elevation={3}>
							<MaterialUI.Grid
								container
								style={{ margin: "0.3em" }}
							>
								{expandedGameItems}
							</MaterialUI.Grid>
						</MaterialUI.Paper>
					</MaterialUI.ExpansionPanelDetails>
				</MaterialUI.ExpansionPanel>
				{gameView}
				<NationPreferencesDialog
					parentCB={c => {
						this.nationPreferencesDialog = c;
					}}
					onSelected={null}
				/>
			</React.Fragment>
		);
	}
}
