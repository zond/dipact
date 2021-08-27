/* eslint-disable no-restricted-globals */
import React from "react";
import * as helpers from "../helpers";
import gtag from "ga-gtag";
import {
	ButtonGroup,
	Button,
	Badge,
	Fab,
	Slide,
	Typography,
} from "@material-ui/core";

import { CreateMessageIcon } from "../icons";
import Globals from "../Globals";
import CreateChannelDialog from "./CreateChannelDialog";
import ChatChannel from "./ChatChannel";
import NationAvatarGroup from "./NationAvatarGroup";
import { generatePath, withRouter } from "react-router-dom";
import { RouteConfig } from "../pages/Router";

class ChatMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			channels: [],
			activeChannel: null,
			createMessageLink: null,
		};
		this.member = (this.props.game.Properties.Members || []).find((e) => {
			return e.User.Email === Globals.user.Email;
		});
		this.variant = Globals.variants.find((v) => {
			return v.Properties.Name === this.props.game.Properties.Variant;
		});
		this.openChannel = this.openChannel.bind(this);
		this.loadChannels = this.loadChannels.bind(this);
		this.closeChannel = this.closeChannel.bind(this);
		this.messageHandler = this.messageHandler.bind(this);
	}
	messageHandler(payload) {
		if (payload.data.message.GameID !== this.props.game.Properties.ID) {
			return false;
		}
		this.loadChannels(true);
		return false;
	}
	loadChannels(silent = false) {
		let channelLink = this.props.game.Links.find((l) => {
			return l.Rel === "channels";
		});
		if (channelLink) {
			if (!silent) {
				helpers.incProgress();
			}
			return helpers
				.safeFetch(helpers.createRequest(channelLink.URL))
				.then((resp) => resp.json())
				.then((js) => {
					if (!silent) {
						helpers.decProgress();
					}
					return new Promise((res, rej) => {
						this.setState(
							(state, props) => {
								state = Object.assign({}, state);

								const { channelId } = this.props.match.params;
								if (channelId) {
									const decodedChannelId = decodeURI(
										this.props.match.params.channelId
									);
									const activeChannel = js.Properties.find(
										(c) =>
											c.Properties.Members.join(",") ===
											decodedChannelId
									);
									state.activeChannel = activeChannel;
								}

								state.channels = js.Properties.sort(
									(c1, c2) => {
										if (
											c1.Properties.Members.length ===
											this.variant.Properties.Nations
												.length
										) {
											return -1;
										} else if (
											c2.Properties.Members.length ===
											this.variant.Properties.Nations
												.length
										) {
											return 1;
										} else if (
											c1.Properties.LatestMessage
										) {
											let d1 = Date.parse(
												c1.Properties.LatestMessage
													.CreatedAt
											);
											let d2 = Date.parse(
												c2.Properties.LatestMessage
													.CreatedAt
											);
											if (d1 > d2) {
												return -1;
											} else if (d2 > d1) {
												return 1;
											} else {
												return 0;
											}
										} else {
											return 0;
										}
									}
								);
								state.createMessageLink = js.Links.find((l) => {
									return l.Rel === "message";
								});
								return state;
							},
							(_) => {
								this.props.unreadMessages(
									this.state.channels.reduce(
										(sum, channel) => {
											if (
												channel.Properties
													.NMessagesSince
											) {
												return (
													sum +
													channel.Properties
														.NMessagesSince
														.NMessages
												);
											} else {
												return sum;
											}
										},
										0
									)
								);
								res();
							}
						);
					});
				});
		} else {
			return Promise.resolve({});
		}
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.isActive && !prevProps.isActive) {
			this.loadChannels(true);
			gtag("set", {
				page_title: "ChatMenu",
				page_location: location.href,
			});
			gtag("event", "page_view");
		}
		const { channelId } = this.props.match.params;
		if (
			prevProps.match.params.channelId !==
			this.props.match.params.channelId
		) {
			if (channelId && this.state.channels) {
				const decodedChannelId = decodeURI(
					this.props.match.params.channelId
				);
				const activeChannel = this.state.channels.find(
					(c) => c.Properties.Members.join(",") === decodedChannelId
				);
				this.setState({ activeChannel: activeChannel });
			}
		}
	}
	componentDidMount() {
		this.loadChannels().then((_) => {
			if (Globals.messaging.subscribe("message", this.messageHandler)) {
				console.log("ChatMenu subscribing to `message` notifications.");
			}
		});
	}
	componentWillUnmount() {
		if (Globals.messaging.unsubscribe("message", this.messageHandler)) {
			console.log("ChatMenu unsubscribing from `message` notifications.");
		}
	}
	openChannel(channel) {
		const channelPath = generatePath(RouteConfig.GameChatChannel, {
			gameId: this.props.game.Properties.ID,
			channelId: channel.Properties.Members.join(","),
		});
		this.props.history.push(channelPath);
	}
	closeChannel() {
		const gamePath = generatePath(RouteConfig.GameTab, {
			gameId: this.props.game.Properties.ID,
			tab: "chat",
		});
		this.props.history.push(gamePath);
		this.setState({ activeChannel: null });
	}

	render() {
		return (
			<div
				style={{
					position: "relative",
					height: "100%",
				}}
			>
				<Slide
					direction="up"
					in={!!this.state.activeChannel}
					mountOnEnter
					unmountOnExit
				>
					<div
						style={{
							top: 0,
							left: 0,
							bottom: 0,
							right: 0,
							background: "#ffffff",
							position: "absolute",
							zIndex: 1200,
						}}
					>
						<ChatChannel
							onNewGameState={this.props.onNewGameState}
							gameState={this.props.gameState}
							game={this.props.game}
							phases={this.props.phases}
							isActive={this.props.isActive}
							createMessageLink={this.state.createMessageLink}
							channel={this.state.activeChannel}
							close={this.closeChannel}
							loaded={(_) => {
								this.loadChannels(true);
							}}
							parent={this}
						/>
					</div>
				</Slide>
				{this.state.channels && this.state.channels.length > 0 ? (
					""
				) : (
					<Typography>No chat channels currently.</Typography>
				)}
				<ButtonGroup
					orientation="vertical"
					style={{
						width: "100%",
						height: "100%",
						transform: "translateZ(0)",
						WebkitTransform: "translateZ(0)",
						overflowY: !!this.state.activeChannel
							? "hidden"
							: "scroll",
					}}
				>
					{this.state.channels.map((channel) => {
						return (
							<Button
								style={{
									width: "100%",
									justifyContent: "left",
									paddingTop: "12px",
									paddingBottom: "12px",
									border: "none",
									borderBottom: "1px solid rgb(40,26,26,0.1)",
									borderRadius: "0px",
								}}
								onClick={(_) => {
									this.openChannel(channel);
								}}
								key={channel.Properties.Members.join(",")}
							>
								{this.member &&
								channel.Properties.NMessagesSince &&
								channel.Properties.NMessagesSince.NMessages >
									0 ? (
									<Badge
										badgeContent={
											channel.Properties.NMessagesSince
												.NMessages
										}
										overlap="circle"
										color="primary"
									>
										{this.variant.Properties.Nations
											.length ===
										channel.Properties.Members.length ? (
											<NationAvatarGroup
												game={this.props.game}
												newGameState={
													this.props.newGameState
												}
												gameState={this.props.gameState}
												variant={this.variant}
												nations={
													channel.Properties.Members
												}
											/>
										) : (
											<NationAvatarGroup
												game={this.props.game}
												newGameState={
													this.props.newGameState
												}
												gameState={this.props.gameState}
												variant={this.variant}
												nations={channel.Properties.Members.filter(
													(n) => {
														return (
															!this.member ||
															n !==
																this.member
																	.Nation
														);
													}
												)}
											/>
										)}
									</Badge>
								) : this.variant.Properties.Nations.length ===
								  channel.Properties.Members.length ? (
									<NationAvatarGroup
										game={this.props.game}
										newGameState={this.props.newGameState}
										gameState={this.props.gameState}
										variant={this.variant}
										nations={channel.Properties.Members}
									/>
								) : (
									<NationAvatarGroup
										game={this.props.game}
										newGameState={this.props.newGameState}
										gameState={this.props.gameState}
										variant={this.variant}
										nations={channel.Properties.Members.filter(
											(n) => {
												return (
													!this.member ||
													n !== this.member.Nation
												);
											}
										)}
									/>
								)}

								{channel.Properties.NMessages &&
								channel.Properties.LatestMessage ? (
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											alignItems: "flex-start",
											marginLeft: "8px",
											minWidth: "0",
										}}
									>
										<Typography
											variant="body1"
											style={{
												textTransform: "none",
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
												width: "100%",
												textAlign: "left",
											}}
										>
											{channel.Properties.Members
												.length ===
											this.variant.Properties.Nations
												.length
												? "Everyone"
												: channel.Properties.Members.filter(
														(n) => {
															return (
																!this.member ||
																n !==
																	this.member
																		.Nation
															);
														}
												  ).map((n, i) => {
														if (i === 0) {
															return n;
														} else {
															return ", " + n;
														}
												  })}{" "}
											({channel.Properties.NMessages})
										</Typography>
										<Typography
											variant="body2"
											style={{
												textTransform: "none",
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
												width: "100%",
												textAlign: "left",
											}}
										>
											{this.member ? (
												this.member.Nation ===
												channel.Properties.LatestMessage
													.Sender ? (
													<span
														style={{
															fontStyle: "italic",
														}}
													>
														You:{" "}
													</span>
												) : channel.Properties.Members
														.length > 2 ? (
													channel.Properties
														.LatestMessage.Sender +
													": "
												) : (
													""
												)
											) : (
												channel.Properties.LatestMessage
													.Sender + ": "
											)}
											{
												channel.Properties.LatestMessage
													.Body
											}
										</Typography>
									</div>
								) : (
									""
								)}
							</Button>
						);
					})}
				</ButtonGroup>
				{this.state.createMessageLink ? (
					<React.Fragment>
						<Fab
							style={{
								margin: "0px",
								top: "auto",
								right: "20px",
								bottom: "20px",
								left: "auto",
								position: "fixed",
								display: !!this.state.activeChannel
									? "none"
									: "flex",
							}}
							color="secondary"
							aria-label="edit"
							onClick={(_) => {
								const newPath = generatePath(
									RouteConfig.GameTab,
									{
										gameId: this.props.game.Properties.ID,
										tab: "chat",
									}
								);
								this.props.history.push(
									newPath + "?create-channel-dialog=1"
								);
							}}
						>
							<CreateMessageIcon />
						</Fab>
						<CreateChannelDialog
							game={this.props.game}
							createChannel={(channel) => {
								const newChannels = this.state.channels;
								const oldChannel = newChannels.find((ch) => {
									return helpers.deepEqual(
										channel.Properties.Members,
										ch.Properties.Members
									);
								});
								if (!oldChannel) {
									newChannels.push(channel);
								}
								const channelToUse = oldChannel || channel;
								this.setState(
									{
										channels: newChannels,
									},
									(_) => {
										gtag("event", "create_chat_channel");
										this.openChannel(channelToUse);
									}
								);
							}}
						/>
					</React.Fragment>
				) : (
					""
				)}
			</div>
		);
	}
}

export default withRouter(ChatMenu);
