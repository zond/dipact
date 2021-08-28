/* eslint-disable no-restricted-globals */
import React from 'react';
import pako from 'pako'

import * as helpers from '../helpers';
import MetadataDialog from './MetadataDialog';
import gtag from 'ga-gtag';
import { Divider, Snackbar, Button, FormControlLabel, FormControl, Box, Select, Tab, Tabs, Badge, AppBar, MenuItem, Toolbar, IconButton, Menu, SvgIcon, Typography, Switch } from "@material-ui/core";

import DipMap from './DipMap';
import ChatMenu from './ChatMenu';

import { ChatIcon, CloseIcon, DownloadIcon, EventIcon, FastForwardIcon, MapIcon, MoreIcon, NextIcon, NumMembersIcon, PreviousIcon, ShareIcon, SettingsIcon } from '../icons';
import OrderList from './OrderList';
import GamePlayers from './GamePlayers';
import GameResults from './GameResults';
import PreliminaryScores from './PreliminaryScores';
import MusteringPopup from './MusteringPopup';
import NationPreferencesDialog from './NationPreferencesDialog';
import Globals from '../Globals';

export default class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			readyReminder: false,
			phaseMessages: [],
			activeTab: "map",
			activePhase: null,
			phases: [],
			corroboration: { Properties: {} },
			variant: null,
			member: null,
			marginTop: 105,
			unreadMessages: 0,
			laboratoryMode: false,
			labEditMode: false,
			labPlayAs: "",
			gameStates: [],
			game: null,
		};
		this.renderedPhaseOrdinal = null;
		this.debugCounters = {};
		this.options = null;
		this.gamePlayersDialog = null;
		this.gameResults = null;
		this.preliminaryScores = null;
		this.nationPreferencesDialog = null;
		this.metadataDialog = null;
		this.changeTab = this.changeTab.bind(this);
		this.debugCount = this.debugCount.bind(this);
		this.changePhase = this.changePhase.bind(this);
		this.loadGame = this.loadGame.bind(this);
		this.receiveCorroboration = this.receiveCorroboration.bind(this);
		this.phaseJumper = this.phaseJumper.bind(this);
		this.phaseMessageHandler = this.phaseMessageHandler.bind(this);
		this.setUnreadMessages = this.setUnreadMessages.bind(this);
		this.labPhaseResolve = this.labPhaseResolve.bind(this);
		this.serializePhaseState = this.serializePhaseState.bind(this);
		this.onNewGameState = this.onNewGameState.bind(this);
		this.join = this.join.bind(this);
		this.joinWithPreferences = this.joinWithPreferences.bind(this);
		this.leave = this.leave.bind(this);
		this.refinePhaseMessage = this.refinePhaseMessage.bind(this);
		// Dead means "unmounted", and is used to stop the chat channel from setting the URL
		// when it gets closed, if the parent game is unmounted.
		this.dead = false;
		this.dip_map = null;
		this.countdownInterval = null;
	}
	debugCount(tag) {
		if (!this.debugCounters[tag]) {
			this.debugCounters[tag] = 0;
		}
		this.debugCounters[tag] += 1;
	}
	refinePhaseMessage(msg) {
		const parts = msg.split(":");
		switch (parts[0]) {
			case "MustDisband":
				return "You must disband " + parts[1] + " units this phase.";
			case "MayBuild":
				return "You may build " + parts[1] + " units this phase.";
            default:
                return "";
		}
	}
	leave() {
		const link = this.state.game.Links.find((l) => {
			return l.Rel === "leave";
		});
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
				gtag("event", "game_leave");
				if (this.props.onLeaveGame) {
					this.props.onLeaveGame();
				}
				this.setState(
					(state, props) => {
						state = Object.assign({}, state);
						state.game.Links = state.game.Links.filter((l) => {
							return l.Rel !== "leave";
						});
						return state;
					},
					(_) => {
						if (this.state.game.Properties.Members.length > 1) {
							this.loadGame();
						}
					}
				);
			});
	}
	join() {
		if (this.state.game.Properties.NationAllocation === 1) {
			this.nationPreferencesDialog.setState({
				open: true,
				nations: this.state.variant.Properties.Nations,
				onSelected: (preferences) => {
					this.joinWithPreferences(preferences);
				},
			});
		} else {
			this.joinWithPreferences([]);
		}
	}
	joinWithPreferences(preferences) {
		const link = this.state.game.Links.find((l) => {
			return l.Rel === "join";
		});
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
				gtag("event", "game_join");
				Globals.messaging.start();
				this.setState(
					(state, props) => {
						state = Object.assign({}, state);
						state.game.Links = state.game.Links.filter((l) => {
							return l.Rel !== "join";
						});
						return state;
					},
					(_) => {
						this.loadGame();
					}
				);
				if (this.props.onJoinGame) {
					this.props.onJoinGame();
				}
			});
	}
	onNewGameState(gameState) {
		this.setState((state, props) => {
			state = Object.assign({}, state);
			state.gameStates = state.gameStates.map((gs) => {
				if (gs.Properties.Nation === gameState.Properties.Nation) {
					gs.Properties = gameState.Properties;
				}
				return gs;
			});
			return state;
		});
	}
	serializePhaseState(phase) {
		return encodeURIComponent(
			encodeURIComponent(
				btoa(
					pako.deflate(
						JSON.stringify({
							activePhase: phase.Properties.PhaseOrdinal,
							phases: this.state.phases
								.map((p) => {
									if (
										p.Properties.PhaseOrdinal ===
										phase.Properties.PhaseOrdinal
									) {
										return phase;
									} else {
										return p;
									}
								})
								.filter((p) => {
									return (
										!p.Properties.GameID ||
										p.Properties.PhaseOrdinal ===
											phase.Properties.PhaseOrdinal
									);
								}),
						}),
						{ to: "string" }
					)
				)
			)
		);
	}
	labPhaseResolve(resolvedPhase, newPhase) {
		this.setState({
			phases: this.state.phases
				.map((oldPhase) => {
					if (
						oldPhase.Properties.PhaseOrdinal ===
						resolvedPhase.Properties.PhaseOrdinal
					) {
						return resolvedPhase;
					} else {
						return oldPhase;
					}
				})
				.filter((oldPhase) => {
					return (
						oldPhase.Properties.PhaseOrdinal <
						newPhase.Properties.PhaseOrdinal
					);
				})
				.concat([newPhase]),
			activePhase: newPhase,
		});
	}
	setUnreadMessages(n) {
		this.setState({ unreadMessages: n });
		if (this.props.unreadMessagesUpdate) {
			this.props.unreadMessagesUpdate();
		}
	}
	phaseJumper(steps) {
		return (_) => {
			let newPhase = this.state.phases.find((p) => {
				return (
					p.Properties.PhaseOrdinal ===
					this.state.activePhase.Properties.PhaseOrdinal + steps
				);
			});
			this.setState({ activePhase: newPhase });
		};
	}
	receiveCorroboration(corr) {
		this.setState({ corroboration: corr });
	}
	componentWillUnmount() {
		if (this.countdownInterval) {
			clearInterval(this.countdownInterval);
		}
		helpers.unback(this.props.close);
		this.dead = true;
		history.pushState("", "", "/");
		if (Globals.messaging.unsubscribe("phase", this.phaseMessageHandler)) {
			console.log("Game unsubscribing from `phase` notifications.");
		}
	}
	componentDidMount() {
		if (this.countdownInterval) {
			clearInterval(this.countdownInterval);
		}
		this.countdownInterval = setInterval((_) => {
			const els = document.getElementsByClassName("minute-countdown");
			for (let i = 0; i < els.length; i++) {
				const el = els[i];
				const deadline = new Date(
					parseFloat(el.getAttribute("dataat"))
				);
				const deltaMinutes =
					((deadline.getTime() - new Date().getTime()) * 1e-3) / 60.0;
				el.innerText = helpers.minutesToDuration(deltaMinutes, true);
			}
		}, 30000);
		this.loadGame().then((_) => {
			helpers.urlMatch(
				[
					[
						/^\/Game\/([^/]+)\/Channel\/([^/]+)\/Messages$/,
						(match) => {
							this.setState({ activeTab: "chat" });
						},
					],
					[
						/^\/Game\/([^/]+)\/Lab\/(.+)$/,
						(match) => {
							const serializedState = JSON.parse(
								pako.inflate(
									atob(
										decodeURIComponent(
											decodeURIComponent(match[2])
										)
									),
									{
										to: "string",
									}
								)
							);
							const newPhases = this.state.phases.slice();
							serializedState.phases.forEach((phase) => {
								newPhases[
									phase.Properties.PhaseOrdinal - 1
								] = phase;
							});
							this.setState({
								laboratoryMode: true,
								activePhase: newPhases.find((phase) => {
									return (
										phase.Properties.PhaseOrdinal ===
										serializedState.activePhase
									);
								}),
								phases: newPhases,
							});
							gtag("set", {
								page_title: "Game",
								page_location: location.href,
							});
							gtag("event", "page_view");
						},
					],
				],
				(_) => {
					history.pushState(
						"",
						"",
						"/Game/" + this.state.game.Properties.ID
					);
				}
			);
			if (
				Globals.messaging.subscribe("phase", this.phaseMessageHandler)
			) {
				console.log("Game subscribing to `phase` notifications.");
			}
		});
		helpers.onback(this.props.close);
	}
	phaseMessageHandler(payload) {
		if (payload.data.gameID !== this.state.game.Properties.ID) {
			return false;
		}
		this.loadGame().then((_) => {
			helpers.snackbar("New phase");
		});
		return true;
	}
	loadGame() {
		return this.props.gamePromise(!!this.state.game).then((game) => {
			const promises = [];
			const gameStatesLink = game.Links.find((l) => {
				return l.Rel === "game-states";
			});
			if (gameStatesLink) {
				promises.push(
					helpers
						.safeFetch(helpers.createRequest(gameStatesLink.URL))
						.then((res) => res.json())
				);
			}
			if (game.Properties.Started) {
				promises.push(
					helpers
						.safeFetch(
							helpers.createRequest(
								game.Links.find((l) => {
									return l.Rel === "phases";
								}).URL
							)
						)
						.then((resp) => resp.json())
						.then((js) => {
							return Promise.resolve(js.Properties);
						})
				);
			} else {
				const variantStartPhase =
					"/Variant/" + game.Properties.Variant + "/Start";
				promises.push(
					helpers.memoize(variantStartPhase, (_) => {
						return helpers
							.safeFetch(helpers.createRequest(variantStartPhase))
							.then((resp) => resp.json())
							.then((js) => {
								js.Properties.PhaseOrdinal = 1;
								return Promise.resolve([js]);
							});
					})
				);
			}
			return Promise.all(promises).then((values) => {
				const gameStates = gameStatesLink ? values[0].Properties : null;
				const phases = gameStatesLink ? values[1] : values[0];
				const member = (game.Properties.Members || []).find((e) => {
					return e.User.Email === Globals.user.Email;
				});
				const variant = Globals.variants.find((v) => {
					return v.Properties.Name === game.Properties.Variant;
				});
				this.setState(
					{
						gameStates: gameStates,
						variant: variant,
						member: member,
						labPlayAs: this.state.labPlayAs
							? this.state.labPlayAs
							: member && member.Nation
							? member.Nation
							: variant.Properties.Nations[0],
						phaseMessages: member
							? (member.NewestPhaseState.Messages || "")
									.split(",")
									.map(this.refinePhaseMessage)
									.filter((m) => {
										return !!m;
									})
							: [],
						readyReminder:
							member &&
							game.Properties.Started &&
							!game.Properties.Finished &&
							(!member.NewestPhaseState.NoOrders ||
								!game.Properties.Mustered) &&
							!member.NewestPhaseState.ReadyToResolve,
						game: game,
						marginTop: this.state.laboratoryMode
							? 56
							: game.Properties.Started
							? 105
							: 157,
						phases: phases,
						activePhase: phases[phases.length - 1],
					},
					(_) => {
						if (this.state.game.Properties.Finished) {
							this.gameResults.setState({
								open: true,
							});
						}
					}
				);
				return Promise.resolve({});
			});
		});
	}
	changeTab(ev, newValue) {
		this.setState({ activeTab: newValue });
	}
	changePhase(ev) {
		this.setState({
			activePhase: this.state.phases.find((phase) => {
				return phase.Properties.PhaseOrdinal === ev.target.value;
			}),
		});
	}
	render() {
		if (this.state.game) {
			return (
				<React.Fragment>
					<AppBar
						key="app-bar"
						position="fixed"
						color={
							this.state.laboratoryMode ? "secondary" : "primary"
						}
					>
						<Toolbar>
							{!this.state.laboratoryMode ? (
								<IconButton
									onClick={this.props.close}
									key="close"
									edge="start"
									color="secondary"
								>
									<CloseIcon />
								</IconButton>
							) : (
								<IconButton
									onClick={(_) => {
										this.setState(
											{
												moreMenuAnchorEl: null,
												laboratoryMode: !this.state
													.laboratoryMode,
											},
											(_) => {
												if (
													!this.state.laboratoryMode
												) {
													this.loadGame();
												} else {
													gtag(
														"event",
														"enable_lab_mode"
													);
												}
											}
										);
									}}
									key="close"
									edge="start"
									color="primary"
								>
									<CloseIcon />
								</IconButton>
							)}
							{!this.state.laboratoryMode &&
							this.state.activePhase &&
							this.state.activePhase.Properties.PhaseOrdinal >
								1 ? (
								<IconButton
									onClick={this.phaseJumper(-1)}
									key="previous"
									edge="start"
									color="secondary"
								>
									<PreviousIcon />
								</IconButton>
							) : !this.state.laboratoryMode ? (
								<Box key="prev-spacer"></Box>
							) : (
								""
							)}

							{this.state.laboratoryMode ? (
								<Typography
									variant="h6"
									style={{ marginRight: "8px" }}
								>
									Sandbox
								</Typography>
							) : (
								""
							)}
							{this.state.activePhase ? (
								<Select
									/* TODO: This might be a stretch, but Laboratory mode has SOME "real" and some "fake" turns. E.g. in spring 1902 I can move back to Spring 1901 and create an "alternative" 1901 and commit that. 
                  Is it possible to make all the "hypothetical" phases to change color? Maybe let me know in the Discord chat and we can discuss more. */
									/*
									 * Yes it is - 'real' phases have .Properties.ID, while fake phases don't (IIRC).
									 */
									style={
										this.state.laboratoryMode
											? {
													width: "100%",
													minWidth: "0",
													borderBottom:
														"1px solid rgba(253, 226, 181, 0.7)",
													color: "rgb(40, 26, 26)",
											  }
											: {
													width: "100%",
													minWidth: "0",
													borderBottom:
														"1px solid rgba(253, 226, 181, 0.7)",
													color: "#FDE2B5",
											  }
									}
									key="phase-select"
									value={
										this.state.activePhase.Properties
											.PhaseOrdinal
									}
									onChange={this.changePhase}
									label={helpers.phaseName(
										this.state.activePhase
									)}
								>
									{this.state.phases.map((phase) => {
										return (
											<MenuItem
												key={
													phase.Properties
														.PhaseOrdinal
												}
												style={{
													textOverflow: "ellipsis",
												}}
												value={
													phase.Properties
														.PhaseOrdinal
												}
											>
												{helpers.phaseName(phase)}
												{!this.state.game.Properties
													.Started ||
												phase.Properties.Resolved ? (
													""
												) : (
													<span
														dataat={
															new Date().getTime() +
															phase.Properties
																.NextDeadlineIn *
																1e-6
														}
														style={{
                                                           position: 'relative',
                                                           top: '-6px',
                                                           fontSize: 'xx-small',
                                                           left: '-5px',
                                                           zIndex: '1',
                                                           backgroundColor: 'red',
                                                           borderRadius: '7px',
                                                           padding: '0 2px 1px 2px'
														}}
													>
														{helpers.minutesToDuration(
															(phase.Properties
																.NextDeadlineIn *
																1e-9) /
																60.0,
															true
														)}
													</span>
												)}
											</MenuItem>
										);
									})}
								</Select>
							) : !this.state.laboratoryMode ? (
								<Box
									key="curr-spacer"
									width="100%"
								></Box>
							) : (
								""
							)}
							{this.state.activePhase &&
							this.state.activePhase.Properties.PhaseOrdinal <
								this.state.phases[this.state.phases.length - 1]
									.Properties.PhaseOrdinal ? (
								<IconButton
									onClick={this.phaseJumper(1)}
									edge="end"
									key="next"
									color="secondary"
								>
									<NextIcon />
								</IconButton>
							) : !this.state.laboratoryMode ? (
								<Box key="next-spacer"></Box>
							) : (
								""
							)}

							{!this.state.laboratoryMode ? (
								<IconButton
									edge="end"
									key="more-icon"
									color="secondary"
									onClick={(ev) => {
										this.setState({
											moreMenuAnchorEl: ev.currentTarget,
										});
									}}
								>
									<SettingsIcon />
								</IconButton>
							) : (
								""
							)}
							<Menu
								anchorEl={this.state.moreMenuAnchorEl}
								anchorOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								transformOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								onClose={(_) => {
									this.setState({ moreMenuAnchorEl: null });
								}}
								open={!!this.state.moreMenuAnchorEl}
							>
								<MenuItem
													key="How to play"
													onClick={(_) => {
														window.open("https://diplicity.notion.site/How-to-play-39fbc4d1f1924c928c3953095062a983", "_blank")
													}}
												>
													How to play
								</MenuItem>
								<Divider />
								<MenuItem
									key="game-metadata"
									onClick={(_) => {
										this.setState({
											moreMenuAnchorEl: null,
										});
										if (
											this.state.game.Properties.Started
										) {
											this.gamePlayersDialog.setState({
												open: true,
											});
										} else {
											this.metadataDialog.setState({
												open: true,
											});
										}
									}}
								>
									Game & player info
								</MenuItem>
								{this.state.game.Properties.Started
									? [
											<MenuItem
												key="scores"
												onClick={(_) => {
													this.setState({
														moreMenuAnchorEl: null,
													});
													this.preliminaryScores.setState(
														{
															open: true,
														}
													);
												}}
											>
												Scores
											</MenuItem>,
											this.state.game.Properties
												.Finished ? (
												<MenuItem
													key="results"
													onClick={(_) => {
														this.setState({
															moreMenuAnchorEl: null,
														});
														this.gameResults.setState(
															{
																open: true,
															}
														);
													}}
												>
													Results
												</MenuItem>
											) : (
												""
											),
									  ]
									: ""}
								<Divider />
								<MenuItem
									key="game-id"
									onClick={(_) => {
										const hrefURL = new URL(location.href);
										helpers
											.copyToClipboard(
												hrefURL.protocol +
													"//" +
													hrefURL.host +
													"/Game/" +
													this.state.game.Properties
														.ID
											)
											.then(
												(_) => {
													this.setState({
														moreMenuAnchorEl: null,
													});
													
													if (this.state.game.Properties.Started) {
														helpers.snackbar(
															"Game URL copied to clipboard. Share it to show the game."
														)} else {
														{
														helpers.snackbar(
															"Game URL copied to clipboard. Share it to invite other players."
														)}
													};
												},
												(err) => {
													console.log(err);
												}
											);
										gtag("event", "game_share");
									}}
								>
									{this.state.game.Properties.Started ? ("Share game") : ("Invite players")}
								</MenuItem>

								<MenuItem
									key="download-map"
									onClick={(_) => {
										this.setState({
											moreMenuAnchorEl: null,
										});
										this.dip_map.downloadMap();
										gtag("event", "download_map");
									}}
								>
									Download map
								</MenuItem>
								<MenuItem
									key="laboratory-mode"
									onClick={(_) => {
										this.setState(
											{
												moreMenuAnchorEl: null,
												laboratoryMode: !this.state
													.laboratoryMode,
											},
											(_) => {
												if (
													!this.state.laboratoryMode
												) {
													this.loadGame();
												} else {
													gtag(
														"event",
														"enable_lab_mode"
													);
												}
											}
										);
									}}
								>
									{this.state.laboratoryMode
										? "Turn off sandbox mode"
										: "Sandbox mode"}
								</MenuItem>
								<Divider />								
								<MenuItem
									key="debug-data"
									onClick={(_) => {
										helpers
											.copyToClipboard(
												JSON.stringify(
													this.debugCounters
												)
											)
											.then((_) => {
												this.setState({
													moreMenuAnchorEl: null,
												});
												helpers.snackbar(
													"Debug data copied to clipboard"
												);
											});
									}}
								>
									Debug
								</MenuItem>
							</Menu>
							{this.state.laboratoryMode ? (
								<React.Fragment>
									<IconButton
										onClick={(_) => {
											this.dip_map.downloadMap();
											gtag("event", "download_map");
										}}
										color="primary"
										edge="end"
										style={{ marginLeft: "auto" }}
									>
										<DownloadIcon />
									</IconButton>
									<IconButton
										onClick={(_) => {
											this.dip_map.labShare();
										}}
										color="primary"
										edge="end"
										style={{ marginLeft: "auto" }}
									>
										<ShareIcon />
									</IconButton>
								</React.Fragment>
							) : (
								""
							)}
						</Toolbar>
						{!this.state.laboratoryMode ? (
							<React.Fragment>
								{!this.state.game.Properties.Started ||
								this.state.game.Links.find((l) => {
									return l.Rel === "join";
								}) ? (
									<Toolbar
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											minHeight: '53px',
										}}
									>
										<div>
											{this.state.game.Links.find((l) => {
												return l.Rel === "join";
											}) ? (
												<Button
													variant="outlined"
													color="secondary"
													key="join"
													onClick={this.join}
												>
													Join
												</Button>
											) : (
												""
											)}
											{this.state.game.Links.find((l) => {
												return l.Rel === "leave";
											}) ? (
												<Button
													variant="outlined"
													color="secondary"
													key="leave"
													onClick={this.leave}
												>
													Leave
												</Button>
											) : (
												""
											)}
										</div>
										<div
											style={{
												display: "flex",
												alignItems: "center",
											}}
										>
											<NumMembersIcon />
											{" "}
											<Typography
												variant="body2"
												style={{ paddingLeft: "2px" }}
											>
												{
													this.state.game.Properties
														.NMembers
												}
												/
												{
													this.state.variant
														.Properties.Nations
														.length
												}{" "}
											</Typography>
										</div>
									</Toolbar>
								) : (
									""
								)}
								<Tabs
									key="tabs"
									value={this.state.activeTab}
									onChange={this.changeTab}
									display="flex"
									variant="fullWidth"
								>
									<Tab
										value="map"
										icon={<MapIcon />}
									/>
									<Tab
										value="chat"
										icon={
											this.state.member &&
											this.state.unreadMessages > 0 ? (
												<Badge
													badgeContent={
														this.state
															.unreadMessages
													}
												>
													<ChatIcon />
												</Badge>
											) : (
												<ChatIcon />
											)
										}
									/>
									{this.state.game.Properties.Started ? (
										this.state.member &&
										!this.state.activePhase.Properties
											.Resolved ? (
											this.state.member.NewestPhaseState
												.OnProbation ||
											!this.state.member.NewestPhaseState
												.ReadyToResolve ? (
												<Tab
													value="orders"
													icon={
														<SvgIcon>
															<path
																d="M9,0 C10.3,0 11.4,0.84 11.82,2 L11.82,2 L16,2 C17.1045695,2 18,2.8954305 18,4 L18,4 L18,18 C18,19.1045695 17.1045695,20 16,20 L16,20 L2,20 C0.8954305,20 0,19.1045695 0,18 L0,18 L0,4 C0,2.8954305 0.8954305,2 2,2 L2,2 L6.18,2 C6.6,0.84 7.7,0 9,0 Z M5,14 L3,14 L3,16 L5,16 L5,14 Z M15,14 L7,14 L7,16 L15,16 L15,14 Z M5,6 L3,6 L3,12 L5,12 L5,6 Z M15,10 L7,10 L7,12 L15,12 L15,10 Z M15,6 L7,6 L7,8 L15,8 L15,6 Z M9,2 C8.44771525,2 8,2.44771525 8,3 C8,3.55228475 8.44771525,4 9,4 C9.55228475,4 10,3.55228475 10,3 C10,2.44771525 9.55228475,2 9,2 Z"
																id="order_open"
															></path>
														</SvgIcon>
													}
												/>
											) : (
												<Tab
													value="orders"
													icon={
														<SvgIcon>
															<path
																d="M9,0 C10.3,0 11.4,0.84 11.82,2 L11.82,2 L16,2 C17.1045695,2 18,2.8954305 18,4 L18,4 L18,18 C18,19.1045695 17.1045695,20 16,20 L16,20 L2,20 C0.8954305,20 0,19.1045695 0,18 L0,18 L0,4 C0,2.8954305 0.8954305,2 2,2 L2,2 L6.18,2 C6.6,0.84 7.7,0 9,0 Z M13.4347826,7 L7.70608696,12.7391304 L4.56521739,9.60869565 L3,11.173913 L7.70608696,15.8695652 L15,8.56521739 L13.4347826,7 Z M9,2 C8.44771525,2 8,2.44771525 8,3 C8,3.55228475 8.44771525,4 9,4 C9.55228475,4 10,3.55228475 10,3 C10,2.44771525 9.55228475,2 9,2 Z"
																id="order_confirmed"
															></path>
														</SvgIcon>
													}
												/>
											)
										) : (
											<Tab
												value="orders"
												icon={<EventIcon />}
											/>
										)
									) : (
										""
									)}
								</Tabs>
							</React.Fragment>
						) : (
							<Toolbar>
								<Typography
									variant="body1"
									style={{ marginRight: "8px" }}
								>
									Edit
								</Typography>
								<FormControlLabel
									key="edit-mode"
									control={
										<Switch
											onChange={(ev) => {
												this.setState({
													labEditMode: !ev.target
														.checked,
												});
												this.dip_map.setState({
													labEditMode: !ev.target
														.checked,
												});
											}}
											color="primary"
											checked={!this.state.labEditMode}
										/>
									}
									label="Play as"
								/>
								{!this.state.labEditMode ? (
									<FormControl
										key="play-as"
										style={{
											flexGrow: 1,
										}}
									>
										<Select
											value={this.state.labPlayAs}
											onChange={(ev) => {
												this.setState({
													labPlayAs: ev.target.value,
												});
												this.dip_map.setState({
													labPlayAs: ev.target.value,
												});
											}}
											style={{
												width: "100%",
												minWidth: "0",
												borderBottom:
													"1px solid rgba(253, 226, 181, 0.7)",
												color: "rgb(40, 26, 26)",
											}}
										>
											{this.state.variant.Properties.Nations.map(
												(nation) => {
													return (
														<MenuItem
															key={nation}
															value={nation}
														>
															{nation}
														</MenuItem>
													);
												}
											)}
										</Select>
									</FormControl>
								) : (
									""
								)}

								<IconButton
									edge="end"
									onClick={(ev) => {
										this.dip_map.labResolve();
									}}
									style={{
										marginLeft: "auto",
										color: "rgb(40, 26, 26)",
									}}
								>
									<FastForwardIcon />
								</IconButton>
							</Toolbar>
						)}
					</AppBar>

					<div
						key="map-container"
						style={
							this.state.laboratoryMode
								? {
										marginTop:
											"" + this.state.marginTop + "px",
										height:
											"calc(100% - " +
											this.state.marginTop +
											"px)",
										backgroundColor: "black",
										display:
											this.state.activeTab === "map"
												? "block"
												: "none",
								  }
								: {
										marginTop:
											"" + this.state.marginTop + "px",
										height:
											"calc(100% - " +
											this.state.marginTop +
											"px)",
										backgroundColor: "black",
										display:
											this.state.activeTab === "map"
												? "block"
												: "none",
								  }
						}
					>
						<DipMap
							parentCB={(c) => {
								this.dip_map = c;
							}}
							onLeaveProbation={(_) => {
								this.loadGame();
							}}
							debugCount={this.debugCount}
							labPhaseResolve={this.labPhaseResolve}
							serializePhaseState={this.serializePhaseState}
							laboratoryMode={this.state.laboratoryMode}
							isActive={this.state.activeTab === "map"}
							game={this.state.game}
							phase={this.state.activePhase}
							corroborateSubscriber={this.receiveCorroboration}
							variant={this.state.variant}
						/>
					</div>
					<React.Fragment>
						<div
							key="chat-container"
							style={{
								marginTop: "" + this.state.marginTop + "px",
								height:
									"calc(100% - " +
									this.state.marginTop +
									"px)",
								display:
									this.state.activeTab === "chat"
										? "block"
										: "none",
							}}
						>
							<ChatMenu
								onNewGameState={this.onNewGameState}
								gameState={
									this.state.member && this.state.gameStates
										? this.state.gameStates.find((gs) => {
												return (
													gs.Properties.Nation ===
													this.state.member.Nation
												);
										  })
										: null
								}
								isActive={this.state.activeTab === "chat"}
								unreadMessages={this.setUnreadMessages}
								phases={this.state.phases}
								game={this.state.game}
								parent={this}
							/>
						</div>
						{this.state.game.Properties.Started ? (
							<div
								key="orders-container"
								style={{
									marginTop: "" + this.state.marginTop + "px",
									overflowY: "scroll",
									height:
										"calc(100% - " +
										this.state.marginTop +
										"px)",
									display:
										this.state.activeTab === "orders"
											? "block"
											: "none",
								}}
							>
								<OrderList
									isActive={this.state.activeTab === "orders"}
									member={this.state.member}
									phase={this.state.activePhase}
									corroboration={this.state.corroboration}
									newPhaseStateHandler={(phaseState) => {
										this.setState((state, props) => {
											state = Object.assign({}, state);
											state.member.NewestPhaseState =
												phaseState.Properties;
											return state;
										});
										if (this.props.onChangeReady) {
											this.props.onChangeReady();
										}
									}}
									variant={this.state.variant}
								/>
							</div>
						) : (
							""
						)}
						<GamePlayers
							gameStates={this.state.gameStates}
							game={this.state.game}
							variant={this.state.variant}
							onNewGameState={this.onNewGameState}
							parentCB={(c) => {
								this.gamePlayersDialog = c;
							}}
						/>
						<PreliminaryScores
							phases={this.state.phases}
							variant={this.state.variant}
							parentCB={(c) => {
								this.preliminaryScores = c;
							}}
						/>
					</React.Fragment>
					{!this.state.game.Properties.Started ? (
						<React.Fragment>
							<NationPreferencesDialog
								parentCB={(c) => {
									this.nationPreferencesDialog = c;
								}}
								onSelected={null}
							/>
							<MetadataDialog
								game={this.state.game}
								parentCB={(c) => {
									this.metadataDialog = c;
								}}
							/>
						</React.Fragment>
					) : (
						""
					)}
					{!this.state.member ||
					!this.state.game.Properties.Started ||
					this.state.game.Properties.Mustered ? (
						""
					) : (
						<MusteringPopup
							viewOrders={(_) => {
								this.setState({
									activeTab: "orders",
									readyReminder: false,
								});
							}}
						/>
					)}
					<GameResults
						onNewGameState={this.onNewGameState}
						gameState={
							this.state.member && this.state.gameStates
								? this.state.gameStates.find((gs) => {
										return (
											gs.Properties.Nation ===
											this.state.member.Nation
										);
								  })
								: null
						}
						game={this.state.game}
						variant={this.state.variant}
						parentCB={(c) => {
							this.gameResults = c;
						}}
					/>
					<Snackbar
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "center",
						}}
						open={this.state.readyReminder}
						autoHideDuration={30000}
						onClose={(_) => {
							this.setState({ readyReminder: false });
						}}
						message={[
							<Typography key="ready-warning">
								You haven't confirmed your orders yet.
								{this.state.game.Properties.Mustered
									? ""
									: " For the game to start, all players have to confirm as ready to play."}
							</Typography>,
						].concat(
							this.state.phaseMessages.map((m) => {
								return (
									<Typography key={m}>
										{m}
									</Typography>
								);
							})
						)}
						action={
							<React.Fragment>
								<Button
									color="secondary"
									size="small"
									onClick={(_) => {
										this.setState({
											activeTab: "orders",
											readyReminder: false,
										});
									}}
								>
									View orders
								</Button>
								<IconButton
									size="small"
									aria-label="close"
									color="inherit"
									onClick={(_) => {
										this.setState({ readyReminder: false });
									}}
								>
									<CloseIcon />
								</IconButton>
							</React.Fragment>
						}
					/>
				</React.Fragment>
			);
		} else {
			return "";
		}
	}
}
