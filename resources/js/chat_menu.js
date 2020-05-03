import * as helpers from '%{ cb "/js/helpers.js" }%';

import CreateChannelDialog from '%{ cb "/js/create_channel_dialog.js" }%';
import ChatChannel from '%{ cb "/js/chat_channel.js" }%';
import NationAvatarGroup from '%{ cb "/js/nation_avatar_group.js" }%';

export default class ChatMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			channels: [],
			activeChannel: null,
			createMessageLink: null
		};
		this.member = this.props.game.Properties.Members.find(e => {
			return e.User.Email == Globals.user.Email;
		});
		this.variant = Globals.variants.find(v => {
			return v.Properties.Name == this.props.game.Properties.Variant;
		});
		this.openChannel = this.openChannel.bind(this);
		this.loadChannels = this.loadChannels.bind(this);
		this.closeChannel = this.closeChannel.bind(this);
		this.natCol = this.natCol.bind(this);
		this.messageHandler = this.messageHandler.bind(this);
		this.canCreateChannel = this.canCreateChannel.bind(this);
		this.createChannelDialog = null;
	}
	messageHandler(payload) {
		if (payload.data.message.GameID != this.props.game.Properties.ID) {
			return false;
		}
		this.loadChannels(true);
		return false;
	}
	loadChannels(silent = false) {
		let channelLink = this.props.game.Links.find(l => {
			return l.Rel == "channels";
		});
		if (channelLink) {
			if (!silent) {
				helpers.incProgress();
			}
			return helpers
				.safeFetch(helpers.createRequest(channelLink.URL))
				.then(resp => resp.json())
				.then(js => {
					if (!silent) {
						helpers.decProgress();
					}
					return new Promise((res, rej) => {
						this.setState(
							(state, props) => {
								state = Object.assign({}, state);

								helpers.urlMatch([
									[
										/^\/Game\/([^\/]+)\/Channel\/([^\/]+)\/Messages$/,
										match => {
											let channel = js.Properties.find(
												c => {
													return (
														c.Properties.Members.join(
															","
														) ==
														decodeURIComponent(
															match[2]
														)
													);
												}
											);
											if (channel) {
												state.activeChannel = channel;
											}
										}
									]
								]);

								state.channels = js.Properties.sort(
									(c1, c2) => {
										if (
											c1.Properties.Members.length ==
											this.variant.Properties.Nations
												.length
										) {
											return -1;
										} else if (
											c2.Properties.Members.length ==
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
								state.createMessageLink = js.Links.find(l => {
									return l.Rel == "message";
								});
								return state;
							},
							_ => {
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
	canCreateChannel() {
		return (
			this.state.createMessageLink &&
			(!this.props.game.Properties.DisablePrivateChat ||
				!this.props.game.Properties.DisableGroupChat ||
				!this.props.game.Properties.DisableConferenceChat)
		);
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.isActive && !prevProps.isActive) {
			this.loadChannels(true);
			gtag("set", { "page": "ChatMenu" });
			gtag("event", "page_view");
		}
	}
	componentDidMount() {
		this.loadChannels().then(_ => {
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
	natCol(nat) {
		return Globals.contrastColors[
			this.variant.Properties.Nations.indexOf(nat)
		];
	}
	openChannel(channel) {
		this.setState({ activeChannel: channel });
	}
	closeChannel() {
		this.setState({ activeChannel: null });
	}

	render() {
		return (
			<div
				style={{
					position: "relative",
					height:
						!this.state.activeChannel &&
						this.state.createMessageLink
							? "100%"
							: "100%"
				}}
			>
				<MaterialUI.Slide
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
							zIndex: 1200
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
							loaded={_ => {
								this.loadChannels(true);
							}}
							parent={this}
						/>
					</div>
				</MaterialUI.Slide>
				<MaterialUI.ButtonGroup
					orientation="vertical"
					className={helpers.scopedClass(
						"width: 100%; height: 100%; transform: translateZ(0); -webkit-transform: translateZ(0);"
					)}
					style={{
						overflowY: !!this.state.activeChannel
							? "hidden"
							: "scroll"
					}}
				>
					{this.state.channels.map(channel => {
						return (
							<MaterialUI.Button
								style={{
									width: "100%",
									justifyContent: "left"
								}}
								onClick={_ => {
									this.openChannel(channel);
								}}
								key={channel.Properties.Members.join(",")}
							>
								{this.member &&
								channel.Properties.NMessagesSince &&
								channel.Properties.NMessagesSince.NMessages >
									0 ? (
									<MaterialUI.Badge
										badgeContent={
											channel.Properties.NMessagesSince
												.NMessages
										}
										overlap="circle"
										color="primary"
									>
										{this.variant.Properties.Nations
											.length ==
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
													n => {
														return (
															!this.member ||
															n !=
																this.member
																	.Nation
														);
													}
												)}
											/>
										)}
									</MaterialUI.Badge>
								) : this.variant.Properties.Nations.length ==
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
											n => {
												return (
													!this.member ||
													n != this.member.Nation
												);
											}
										)}
									/>
								)}

								{channel.Properties.NMessages &&
								channel.Properties.LatestMessage ? (
									<div
										className={helpers.scopedClass(
											"display: flex; flex-direction: column; align-items: flex-start; margin-left: 8px; min-width: 0;"
										)}
									>
										<MaterialUI.Typography
											variant="subtitle2"
											className={helpers.scopedClass(
												"text-transform: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%; text-align: left;"
											)}
										>
											{channel.Properties.Members
												.length ==
											this.variant.Properties.Nations
												.length
												? "Everyone"
												: channel.Properties.Members.filter(
														n => {
															return (
																!this.member ||
																n !=
																	this.member
																		.Nation
															);
														}
												  ).map((n, i) => {
														if (i == 0) {
															return n;
														} else {
															return ", " + n;
														}
												  })}{" "}
											({channel.Properties.NMessages})
										</MaterialUI.Typography>
										<MaterialUI.Typography
											variant="body2"
											className={helpers.scopedClass(
												"text-transform: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%; text-align: left;"
											)}
										>
											{this.member ? (
												this.member.Nation ==
												channel.Properties.LatestMessage
													.Sender ? (
													<span
														style={{
															fontStyle: "italic"
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
										</MaterialUI.Typography>
									</div>
								) : (
									""
								)}
							</MaterialUI.Button>
						);
					})}
				</MaterialUI.ButtonGroup>
				{this.canCreateChannel() ? (
					<React.Fragment>
						<MaterialUI.Fab
							className={helpers.scopedClass(`
								margin: 0px;
								top: auto;
								right: 20px;
								bottom: 20px;
								left: auto;
								position: fixed;
							`)}
							style={{
								display: !!this.state.activeChannel
									? "none"
									: "flex"
							}}
							color="secondary"
							aria-label="edit"
							onClick={_ => {
								this.createChannelDialog.setState({
									open: true
								});
							}}
						>
							{helpers.createIcon("\ue145")}
						</MaterialUI.Fab>
						<CreateChannelDialog
							game={this.props.game}
							createChannel={channel => {
								this.setState(
									{
										channels: this.state.channels.concat([
											channel
										])
									},
									_ => {
										this.openChannel(channel);
									}
								);
							}}
							parentCB={c => {
								this.createChannelDialog = c;
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
