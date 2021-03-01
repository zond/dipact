import * as helpers from '%{ cb "/js/helpers.js" }%';

import GameMetadata from '%{ cb "/js/game_metadata.js" }%';
import Game from '%{ cb "/js/game.js" }%';
import NationPreferencesDialog from '%{ cb "/js/nation_preferences_dialog.js" }%';
import RenameGameDialog from '%{ cb "/js/rename_game_dialog.js" }%';
import ManageInvitationsDialog from '%{ cb "/js/manage_invitations_dialog.js" }%';
import RescheduleDialog from '%{ cb "/js/reschedule_dialog.js" }%';

const warningClass = helpers.scopedClass("color: red;");
const noticeClass = helpers.scopedClass("font-weight: bold !important;");
const secondRowSummaryClass = helpers.scopedClass(`
display: flex;
flex-direction: row;
justify-content: space-between;
flex-wrap: wrap;`);
const secondRowSummaryColorClass = helpers.scopedClass(
	"color: rgba(40, 26, 26, 0.7);"
);
const summaryIconsAndPhaseClass = helpers.scopedClass(
	"display: flex; justify-content: right;"
);
const summaryIconsClass = helpers.scopedClass("padding-right: 4px;");
const sixteenBySixteenClass = helpers.scopedClass(
	"height: 16px !important; width: 16px !important;"
);

export default class GameListElement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			game: this.props.game,
			viewOpen: false,
			expanded: false,
			member: (props.game.Properties.Members || []).find((e) => {
				return e.User.Email == Globals.user.Email;
			}),
			// Dead means that we left this game when we were the only member, or deleted it as the GM, so it's gone.
			dead: false,
		};
		this.variant = Globals.variants.find((v) => {
			return v.Properties.Name == this.props.game.Properties.Variant;
		});
		this.nationPreferencesDialog = null;
		this.renameGameDialog = null;
		this.manageInvitationsDialog = null;
		this.rescheduleDialog = null;
		this.valignClass = helpers.scopedClass(
			"display: flex; align-items: center;"
		);
		this.viewGame = this.viewGame.bind(this);
		this.closeGame = this.closeGame.bind(this);
		this.getIcons = this.getIcons.bind(this);
		this.joinGame = this.joinGame.bind(this);
		this.deleteGame = this.deleteGame.bind(this);
		this.leaveGame = this.leaveGame.bind(this);
		this.renameGame = this.renameGame.bind(this);
		this.manageInvitations = this.manageInvitations.bind(this);
		this.joinGameWithPreferences = this.joinGameWithPreferences.bind(this);
		this.reloadGame = this.reloadGame.bind(this);
		this.reschedule = this.reschedule.bind(this);
		this.onRescheduleSubmit = this.onRescheduleSubmit.bind(this);
		this.phaseMessageHandler = this.phaseMessageHandler.bind(this);
		this.messageHandler = this.messageHandler.bind(this);
		this.addIconWithTooltip = this.addIconWithTooltip.bind(this);
	}
	onRescheduleSubmit(minutes) {
		const link = this.state.game.Links.find((link) => {
			return link.Rel == "edit-newest-phase-deadline-at";
		});
		if (!link) return;
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest(link.URL, {
					method: link.Method,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						NextPhaseDeadlineInMinutes: Number.parseInt(minutes),
					}),
				})
			)
			.then((_) => {
				helpers.decProgress();
				gtag("event", "game_list_element_reschedule");
				this.reloadGame();
			});
	}
	reschedule() {
		this.rescheduleDialog.setState({ open: true });
	}
	renameGame() {
		this.renameGameDialog.setState({ open: true });
	}
	manageInvitations() {
		this.manageInvitationsDialog.setState({ open: true });
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
		if (this.props.onPhaseMessage) {
			this.props.onPhaseMessage();
		} else {
			this.reloadGame();
		}
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
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						NationPreferences: preferences.join(","),
					}),
				})
			)
			.then((_) => {
				helpers.decProgress();
				gtag("event", "game_list_element_join");
				Globals.messaging.start();
				this.reloadGame();
			});
	}
	reloadGame() {
		return new Promise((res, rej) => {
			helpers
				.safeFetch(
					helpers.createRequest(
						this.state.game.Links.find((l) => {
							return l.Rel == "self";
						}).URL
					)
				)
				.then((resp) => resp.json())
				.then((js) => {
					this.setState(
						{
							game: js,
							member: (js.Properties.Members || []).find((e) => {
								return e.User.Email == Globals.user.Email;
							}),
						},
						(_) => {
							res(js);
						}
					);
				});
		});
	}
	deleteGame(link) {
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest(link.URL, {
					method: link.Method,
				})
			)
			.then((resp) => resp.json())
			.then((_) => {
				helpers.decProgress();
				gtag("event", "game_list_element_delete_game");
				this.setState((state, props) => {
					state = Object.assign({}, state);
					state.game.Links = [];
					state.dead = true;
					return state;
				});
			});
	}
	leaveGame(link) {
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest(link.URL, {
					method: link.Method,
				})
			)
			.then((resp) => resp.json())
			.then((_) => {
				helpers.decProgress();
				gtag("event", "game_list_element_leave");
				let newDead = false;
				if (
					this.state.game.Properties.GameMasterEnabled ||
					this.state.game.Properties.Members.length > 1
				) {
					newDead = false;
				} else {
					newDead = true;
				}
				this.setState(
					(state, props) => {
						state = Object.assign({}, state);
						state.game.Links = state.game.Links.filter((l) => {
							return l.Rel != "leave";
						});
						state.dead = newDead;
						return state;
					},
					(_) => {
						if (!newDead) {
							this.reloadGame();
						}
					}
				);
			});
	}
	joinGame(link) {
		if (this.state.game.Properties.NationAllocation == 1) {
			this.nationPreferencesDialog.setState({
				open: true,
				nations: this.variant.Properties.Nations,
				onSelected: (preferences) => {
					this.joinGameWithPreferences(link, preferences);
				},
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
	addIconWithTooltip(ary, codepoint, color, tooltip) {
		ary.push(
			<MaterialUI.Tooltip
				key={"" + codepoint + color + tooltip}
				disableFocusListener
				title={tooltip}
			>
				{helpers.createIcon(codepoint, {
					padding: "4px 1px 0px 1px",
					color: color,
					fontSize: "14px",
				})}
			</MaterialUI.Tooltip>
		);
	}
	getIcons() {
		let itemKey = 0;
		let icons = [];
		if (this.state.game.Properties.GameMasterEnabled) {
			this.addIconWithTooltip(
				icons,
				"\ue90e",
				"black",
				"Game master present"
			);
		}
		if (this.state.game.Properties.ChatLanguageISO639_1) {
			icons.push(
				<MaterialUI.Tooltip
					key="header-lang-icon"
					disableFocusListener
					title={
						"Chat language: " +
						helpers.iso639_1Codes.find((el) => {
							return (
								el.code ==
								this.state.game.Properties.ChatLanguageISO639_1
							);
						}).name
					}
				>
					<span className="speech-bubble">
						{this.state.game.Properties.ChatLanguageISO639_1}
					</span>
				</MaterialUI.Tooltip>
			);
		}
		if (!this.state.game.Properties.SkipMuster) {
			this.addIconWithTooltip(
				icons,
				"\ue925",
				"black",
				"Mustering before start"
			);
		}
		if (
			this.state.game.Properties.MinQuickness ||
			this.state.game.Properties.MinReliability
		) {
			this.addIconWithTooltip(
				icons,
				"\ue425",
				"black",
				"Minimum quickness or reliability requirement"
			);
		}
		if (
			this.state.game.Properties.MinRating ||
			this.state.game.Properties.MaxRating
		) {
			this.addIconWithTooltip(
				icons,
				"\ue83a",
				"black",
				"Minimum rating requirement"
			);
		}
		if (
			this.state.game.Properties.MaxHater ||
			this.state.game.Properties.MaxHated
		) {
			icons.push(
				<MaterialUI.Tooltip
					key={itemKey++}
					disableFocusListener
					title="Maximum hate requirement"
				>
					<MaterialUI.SvgIcon className={sixteenBySixteenClass}>
						<g
							id="Artboard"
							stroke="none"
							strokeWidth="1"
							fill="none"
							fillRule="evenodd"
						>
							<g
								id="emoticon-angry-outline"
								transform="translate(2.000000, 2.000000)"
								fill="#000000"
								fillRule="nonzero"
							>
								<path
									d="M1.499,0.115 L19.2847763,17.8994949 L19.299,17.885 L19.8994949,18.4852814 L18.4852814,19.8994949 L16.3286725,17.7426435 C14.5506593,19.1960497 12.3167744,20 10,20 C7.3478351,20 4.80429597,18.9464316 2.92893219,17.0710678 C1.0535684,15.195704 0,12.6521649 0,10 C0,7.59864107 0.846427847,5.39497595 2.25721107,3.67107713 L0.100505063,1.51471863 L1.499,0.115 Z M3.68005389,5.09447025 C2.62704639,6.44913544 2,8.15134045 2,10 C2,14.418278 5.581722,18 10,18 C11.8486595,18 13.5508646,17.3729536 14.9055298,16.3199461 L13.293,14.707 L12.77,15.23 C12.32,14.5 11.25,14 10,14 C8.75,14 7.68,14.5 7.23,15.23 L5.81,13.81 C6.71,12.72 8.25,12 10,12 C10.2091413,12 10.4152832,12.0102834 10.6176919,12.0302527 L7.32314129,8.73840737 C7.08353442,8.90238797 6.7987395,9 6.5,9 C5.7,9 5,8.3 5,7.5 L5,6.414 L3.68005389,5.09447025 Z M10,0 C12.6521649,0 15.195704,1.0535684 17.0710678,2.92893219 C18.9464316,4.80429597 20,7.3478351 20,10 C20,11.6325537 19.6007944,13.2239482 18.8564416,14.6436748 L17.3584074,13.144315 C17.7713793,12.1791202 18,11.1162587 18,10 C18,7.87826808 17.1571453,5.84343678 15.6568542,4.34314575 C14.1565632,2.84285472 12.1217319,2 10,2 C8.88374129,2 7.82087979,2.22862069 6.85568497,2.64159261 L5.35539972,1.1417664 C6.74323813,0.41258719 8.32343661,0 10,0 Z M15,6 L15,7.5 C15,8.3 14.3,9 13.5,9 C12.7,9 12,8.3 12,7.5 L15,6 Z"
									id="Combined-Shape"
								></path>
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
				<MaterialUI.Tooltip
					key={itemKey++}
					disableFocusListener
					title="Chat disabled"
				>
					<MaterialUI.SvgIcon className={sixteenBySixteenClass}>
						<g
							id="Artboard"
							stroke="none"
							strokeWidth="1"
							fill="none"
							fillRule="evenodd"
						>
							<g id="message-24px">
								<polygon
									id="Path"
									points="0 0 24 0 24 24 0 24"
								></polygon>
								<path
									d="M2.4,2.614 L20.5847763,20.7989899 L20.598,20.784 L20.7989899,20.9842712 L19.3847763,22.3984848 L14.986,18 L6,18 L2,22 L2.008,5.022 L1,4.0137085 L2.4,2.614 Z M20,2 C21.05,2 21.9177686,2.82004132 21.9944872,3.85130541 L22,4 L22,16 C22,16.9134058 21.3794387,17.6889091 20.539101,17.925725 L16.614,14 L18,14 L18,12 L14.614,12 L13.614,11 L18,11 L18,9 L11.614,9 L10.614,8 L18,8 L18,6 L8.614,6 L4.614,2 L20,2 Z M8.987,12 L6,12 L6,14 L10.986,14 L8.987,12 Z M6,9.013 L6,11 L7.987,11 L6,9.013 Z"
									id="Combined-Shape"
									fill="#000000"
									fillRule="nonzero"
								></path>
							</g>
						</g>
					</MaterialUI.SvgIcon>
				</MaterialUI.Tooltip>
			);
		}
		if (this.state.game.Properties.Private) {
			this.addIconWithTooltip(icons, "\ue897", "black", "Private game");
		}
		if (this.state.game.Properties.NationAllocation == 1) {
			this.addIconWithTooltip(
				icons,
				"\ue065",
				"black",
				"Preference based nation allocation"
			);
		}
		return <MaterialUI.Box display="inline">{icons}</MaterialUI.Box>;
	}
	failureExplanations() {
		return {
			Hated: "Your 'hated' score is too high.",
			Hater: "Your 'hater' score is too high.",
			MaxRating: "Your rating is too high.",
			MinRating: "Your rating is too low.",
			MinReliability: "Your reliability score is too low.",
			MinQuickness: "Your quickness score is too low.",
			InvitationNeeded: "A game master whitelisting is required.",
		};
	}
	render() {
		let itemKey = 0;
		let buttons = [];
		if (
			this.state.game.Properties.Open &&
			this.state.game.Properties.ActiveBans &&
			this.state.game.Properties.ActiveBans.length > 0
		) {
			buttons.push(
				<MaterialUI.Typography
					key="banned-notice"
					className={noticeClass}
				>
					You can't join because you banned or are banned by a player.
				</MaterialUI.Typography>
			);
		}
		if (
			!this.state.game.Properties.Closed &&
			this.state.game.Properties.FailedRequirements
		) {
			buttons.push(
				<MaterialUI.Typography
					key="requirement-notice"
					className={noticeClass}
				>
					You can't join this game because:{" "}
					{this.state.game.Properties.FailedRequirements.map(
						(req) => {
							return this.failureExplanations()[req];
						}
					).join(" ")}
				</MaterialUI.Typography>
			);
		}

		if (!this.state.dead) {
			buttons.push(
				<MaterialUI.Button
					variant="outlined"
					style={{
						marginRight: "16px",
						minWidth: "100px",
						marginBottom: "4px",
					}}
					color="primary"
					onClick={this.viewGame}
					key={itemKey++}
				>
					View
				</MaterialUI.Button>
			);
			if (this.state.member) {
				buttons.push(
					<MaterialUI.Button
						variant="outlined"
						style={{
							marginRight: "16px",
							minWidth: "100px",
							marginBottom: "4px",
						}}
						color="primary"
						onClick={this.renameGame}
						key={itemKey++}
					>
						Rename
					</MaterialUI.Button>
				);
			}
		}
		let hasInviteDialog = false;
		this.state.game.Links.forEach((link) => {
			if (link.Rel == "join") {
				if (
					this.state.game.Properties.PhaseLengthMinutes < 60 * 12 ||
					(this.state.game.Properties.NonMovementPhaseLengthMinutes !=
						0 &&
						this.state.game.Properties
							.NonMovementPhaseLengthMinutes <
							60 * 12)
				) {
					buttons.unshift(
						<MaterialUI.Typography
							key="deadline-warning"
							className={warningClass}
						>
							WARNING: This game has short deadlines (less than 12
							hours). If it starts while you're unavailable, you
							might miss parts of the game greatly impacting your
							reliability score.
						</MaterialUI.Typography>
					);
				}
				if (
					!this.state.game.Properties.Private &&
					this.state.game.Properties.MinReliability == 0 &&
					Globals.userStats.Properties.Reliability >= 10
				) {
					buttons.unshift(
						<MaterialUI.Typography
							key="reliability-warning"
							className={warningClass}
						>
							WARNING: We advise you to join a different game,
							because you have high reliability. Since this game
							has no reliability requirements, it might have
							(some) absent players.
						</MaterialUI.Typography>
					);
				}
				buttons.push(
					<MaterialUI.Button
						key={itemKey++}
						variant="outlined"
						color="primary"
						style={{ marginRight: "16px", minWidth: "100px" }}
						onClick={(_) => {
							this.joinGame(link);
						}}
					>
						Join
					</MaterialUI.Button>
				);
			} else if (link.Rel == "edit-newest-phase-deadline-at") {
				buttons.push(
					<MaterialUI.Button
						key={itemKey++}
						variant="outlined"
						color="primary"
						style={{
							marginRight: "16px",
							minWidth: "100px",
							marginBottom: "4px",
						}}
						onClick={(_) => {
							this.reschedule(link);
						}}
					>
						Reschedule
					</MaterialUI.Button>
				);
			} else if (link.Rel == "leave") {
				buttons.push(
					<MaterialUI.Button
						key={itemKey++}
						variant="outlined"
						color="primary"
						style={{
							marginRight: "16px",
							minWidth: "100px",
							marginBottom: "4px",
						}}
						onClick={(_) => {
							this.leaveGame(link);
						}}
					>
						Leave
					</MaterialUI.Button>
				);
			} else if (link.Rel == "delete-game") {
				buttons.push(
					<MaterialUI.Button
						key={itemKey++}
						variant="outlined"
						color="primary"
						style={{
							marginRight: "16px",
							minWidth: "100px",
							marginBottom: "4px",
						}}
						onClick={(_) => {
							this.deleteGame(link);
						}}
					>
						Delete
					</MaterialUI.Button>
				);
			} else if (
				link.Rel == "invite-user" ||
				link.Rel.indexOf("uninvite-") == 0
			) {
				hasInviteDialog = true;
			}
		});
		if (hasInviteDialog) {
			buttons.push(
				<MaterialUI.Button
					key={itemKey++}
					variant="outlined"
					color="primary"
					style={{
						marginRight: "16px",
						minWidth: "100px",
						marginBottom: "4px",
					}}
					onClick={(_) => {
						this.manageInvitations();
					}}
				>
					Whitelist
				</MaterialUI.Button>
			);
		}
		const buttonDiv = (
			<div
				key={itemKey++}
				style={{
					dispay: "flex",
					justifyContent: "space-evenly",
					marginBottom: "8px",
				}}
			>
				{buttons}
			</div>
		);

		let summary = (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					width: "100%",

					marginTop: "8px",
				}}
			>
				{((_) => {
					if (this.state.game.Properties.Started) {
						return (
							<React.Fragment>
								{/* IF STARTED */}
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between",
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
												maxWidth: "calc(100% - 70px)",
											}}
										>
											<MaterialUI.Typography
												textroverflow="ellipsis"
												noWrap
												style={{
													color:
														"rgba(40, 26, 26, 1)",
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
												color: "rgba(40, 26, 26, 1)",
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
											color: "#281A1A",
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
														fillRule="nonzero"
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
												color: "rgba(40, 26, 26, 1)",
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
									className={secondRowSummaryClass}
								>
									<MaterialUI.Typography
										textroverflow="ellipsis"
										noWrap={true}
										display="inline"
										variant="caption"
										id="variant"
										className={secondRowSummaryColorClass}
									>
										{this.state.game.Properties.Variant}{" "}
										{helpers.phaseLengthDisplay(
											this.state.game.Properties
										)}
									</MaterialUI.Typography>
									<div className={summaryIconsAndPhaseClass}>
										<div className={summaryIconsClass}>
											{this.getIcons()}
										</div>
										<MaterialUI.Typography
											variant="caption"
											className={
												secondRowSummaryColorClass
											}
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
								</div>
								{!this.state.member ||
								this.state.game.Properties.Mustered ? (
									""
								) : (
										this.state.game.Properties.Members || []
								  ).find((m) => {
										return m.User.Id == Globals.user.Id;
								  }).NewestPhaseState.ReadyToResolve ? (
									<MaterialUI.Typography>
										Confirmed ready{" "}
										{helpers.createIcon("\ue5ca")}
									</MaterialUI.Typography>
								) : (
									<MaterialUI.Button
										variant="outlined"
										style={{
											marginRight: "16px",
											minWidth: "100px",
											marginBottom: "4px",
										}}
										color="primary"
										onClick={(ev) => {
											ev.stopPropagation();
											helpers
												.safeFetch(
													helpers.createRequest(
														"/Game/" +
															this.state.game
																.Properties.ID +
															"/Phase/" +
															this.state.game
																.Properties
																.NewestPhaseMeta[0]
																.PhaseOrdinal +
															"/PhaseState",
														{
															headers: {
																"Content-Type":
																	"application/json",
															},
															method: "PUT",
															body: JSON.stringify(
																{
																	ReadyToResolve: true,
																}
															),
														}
													)
												)
												.then(this.reloadGame);
										}}
										key={itemKey++}
									>
										Confirm ready
									</MaterialUI.Button>
								)}
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
										justifyContent: "space-between",
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
											alignItems: "center",
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
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between",
									}}
								>
									<MaterialUI.Typography
										textroverflow="ellipsis"
										noWrap={true}
										display="inline"
										variant="caption"
										style={{
											color: "rgba(40, 26, 26, 0.7)",
										}}
									>
										{this.state.game.Properties.Variant}{" "}
										{helpers.phaseLengthDisplay(
											this.state.game.Properties
										)}
									</MaterialUI.Typography>
									<div> {this.getIcons()}</div>
								</div>
							</React.Fragment>
						);
					}
				})()}

				<div></div>
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
						background: "#ffffff",
					}}
				>
					<Game
						onChangeReady={this.reloadGame}
						onJoinGame={this.reloadGame}
						onLeaveGame={(_) => {
							if (this.state.game.Properties.Members.length > 1) {
								this.reloadGame();
							} else {
								this.setState({ dead: true });
							}
						}}
						unreadMessagesUpdate={this.reloadGame}
						gamePromise={(reload) => {
							if (reload) {
								return helpers
									.safeFetch(
										helpers.createRequest(
											this.state.game.Links.find((l) => {
												return l.Rel == "self";
											}).URL
										)
									)
									.then((resp) => resp.json());
							} else {
								return new Promise((res, rej) => {
									res(this.state.game);
								});
							}
						}}
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
					{this.state.viewOpen ? gameView : ""}
				</React.Fragment>
			);
		}
		return (
			<React.Fragment>
				<MaterialUI.ExpansionPanel
					key="game-details"
					onChange={(ev, exp) => {
						this.setState({ expanded: exp });
					}}
					square
					style={{
						border: "none",
						boxShadow: "none",
						padding: "0px",
						margin: "0px",
					}}
				>
					<MaterialUI.ExpansionPanelSummary
						classes={{
							root: helpers.scopedClass("padding: 0px;"),
							content: helpers.scopedClass(
								"max-width: calc(100% - 32px);"
							),
						}}
						expandIcon={helpers.createIcon("\ue5cf")}
					>
						{summary}
					</MaterialUI.ExpansionPanelSummary>
					<MaterialUI.ExpansionPanelDetails
						classes={{
							root: helpers.scopedClass("padding: 0px;"),
						}}
					>
						{this.state.expanded ? (
							<div>
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between",
										flexWrap: "wrap",
										maxWidth: "960px",
										width: "100%",
										marginBottom: "16px",
									}}
								>
									<div
										style={{
											maxWidth: "460px",
										}}
									>
										{buttonDiv}
										{this.state.dead ? (
											<MaterialUI.Typography
												style={{ color: "red" }}
											>
												Deleted
											</MaterialUI.Typography>
										) : (
											""
										)}
										<GameMetadata
											game={this.state.game}
											withKickButtons={true}
											reloadGame={this.reloadGame}
										/>
									</div>
								</div>
								<MaterialUI.Divider />
							</div>
						) : (
							""
						)}
					</MaterialUI.ExpansionPanelDetails>
				</MaterialUI.ExpansionPanel>
				{this.state.viewOpen ? gameView : ""}
				<NationPreferencesDialog
					parentCB={(c) => {
						this.nationPreferencesDialog = c;
					}}
					onSelected={null}
				/>
				{this.state.member ? (
					<RenameGameDialog
						onRename={this.reloadGame}
						game={this.state.game}
						parentCB={(c) => {
							this.renameGameDialog = c;
						}}
					/>
				) : (
					""
				)}
				{this.state.game.Properties.GameMaster &&
				this.state.game.Properties.GameMaster.Id == Globals.user.Id ? (
					<React.Fragment>
						<RescheduleDialog
							parentCB={(c) => {
								this.rescheduleDialog = c;
							}}
							onSubmit={this.onRescheduleSubmit}
						/>
						<ManageInvitationsDialog
							game={this.state.game}
							parentCB={(c) => {
								this.manageInvitationsDialog = c;
							}}
							reloadGame={this.reloadGame}
						/>
					</React.Fragment>
				) : (
					""
				)}
			</React.Fragment>
		);
	}
}
