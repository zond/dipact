import * as helpers from '%{ cb "/js/helpers.js" }%';

import CreateChannelDialog from '%{ cb "/js/create_channel_dialog.js" }%';
import ChatChannel from '%{ cb "/js/chat_channel.js" }%';
import NationAvatar from '%{ cb "/js/nation_avatar.js" }%';

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
		this.createChannelDialog = null;
	}
	messageHandler(payload) {
		if (payload.data.message.GameID != this.props.game.Properties.ID) {
			return false;
		}
		if (
			!this.state.channels.find(c => {
				return (
					c.Properties.Members.join(",") ==
					payload.data.message.ChannelMembers.join(",")
				);
			})
		) {
			this.loadChannels();
		}
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
						this.setState((state, props) => {
							state = Object.assign({}, state);

							helpers.urlMatch([
								[
									/^\/Game\/([^\/]+)\/Channel\/([^\/]+)\/Messages$/,
									match => {
										let channel = js.Properties.find(c => {
											return (
												c.Properties.Members.join(
													","
												) == match[2]
											);
										});
										if (channel) {
											state.activeChannel = channel;
										}
									}
								]
							]);

							state.channels = js.Properties;
							state.createMessageLink = js.Links.find(l => {
								return l.Rel == "message";
							});
							return state;
						}, res);
					});
				});
		} else {
			return Promise.resolve({});
		}
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.isActive && !prevProps.isActive) {
			this.loadChannels(true);
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
							game={this.props.game}
							phases={this.props.phases}
							isActive={this.props.isActive}
							createMessageLink={this.state.createMessageLink}
							channel={this.state.activeChannel}
							close={this.closeChannel}
							parent={this}
						/>
					</div>
				</MaterialUI.Slide>
				<MaterialUI.ButtonGroup
					orientation="vertical"
					style={{
						width: "100%",
						height: "100%",
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
										color="primary"
									>
										{helpers.channelName(
											channel,
											this.variant
										)}
									</MaterialUI.Badge>
								) : (
									helpers.channelName(channel, this.variant)
								)}
							</MaterialUI.Button>
						);
					})}
				</MaterialUI.ButtonGroup>
				{this.state.createMessageLink ? (
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
