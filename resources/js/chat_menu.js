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
			channelOpen: false,
			createMessageLink: null
		};
		this.member = this.props.game.Properties.Members.find(e => {
			return e.User.Email == Globals.user.Email;
		});
		this.variant = Globals.variants.find(v => {
			return v.Properties.Name == this.props.game.Properties.Variant;
		});
		this.openChannel = this.openChannel.bind(this);
		this.closeChannel = this.closeChannel.bind(this);
		this.channelName = this.channelName.bind(this);
		this.natCol = this.natCol.bind(this);
		this.createChannelDialog = null;
	}
	componentDidMount() {
		let channelLink = this.props.game.Links.find(l => {
			return l.Rel == "channels";
		});
		if (channelLink) {
			helpers.incProgress();
			helpers
				.safeFetch(helpers.createRequest(channelLink.URL))
				.then(resp => resp.json())
				.then(js => {
					helpers.decProgress();
					this.setState((state, props) => {
						state = Object.assign({}, state);

						helpers.urlMatch([
							[
								/^\/Game\/([^\/]+)\/Channel\/([^\/]+)\/Messages$/,
								match => {
									let channel = js.Properties.find(c => {
										return (
											c.Properties.Members.join(",") ==
											match[2]
										);
									});
									if (channel) {
										state.activeChannel = channel;
										state.channelOpen = true;
									}
								}
							]
						]);

						state.channels = js.Properties;
						state.createMessageLink = js.Links.find(l => {
							return l.Rel == "message";
						});
						return state;
					});
				});
		}
	}
	natCol(nat) {
		return Globals.contrastColors[
			this.variant.Properties.Nations.indexOf(nat)
		];
	}
	channelName(channel) {
		if (!channel) {
			return "";
		}
		if (
			channel.Properties.Members.length ==
			this.variant.Properties.Nations.length
		) {
			return (
				<MaterialUI.Avatar
					style={{ border: "none" }}
					className={helpers.avatarClass}
					key="Everyone"
					alt="Everyone"
					src="/static/img/un_logo.svg"
				/>
			);
		}
		return channel.Properties.Members.map(member => {
			return (
				<NationAvatar
					key={member}
					variant={this.variant}
					nation={member}
				/>
			);
		});
	}
	openChannel(channel) {
		this.setState({ activeChannel: channel, channelOpen: true });
	}
	closeChannel() {
		this.setState({ channelOpen: false });
	}
	render() {
		return (
			<div style={{ position: "relative", height: "calc(100% - 57px)" }}>
				<MaterialUI.Slide
					direction="up"
					in={this.state.channelOpen}
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
							channelName={this.channelName(
								this.state.activeChannel
							)}
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
						overflowY: this.state.channelOpen ? "hidden" : "scroll"
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
								{this.channelName(channel)}
							</MaterialUI.Button>
						);
					})}
				</MaterialUI.ButtonGroup>
				<MaterialUI.AppBar
					position="fixed"
					color="primary"
					style={{ top: "auto", bottom: 0 }}
				>
					<MaterialUI.Toolbar
						style={{ justifyContent: "space-around" }}
					>
						<MaterialUI.Button
							key="new-channel"
							variant="outlined"
							color="secondary"
							onClick={_ => {
								this.createChannelDialog.setState({
									open: true
								});
							}}
						>
							New channel
						</MaterialUI.Button>
					</MaterialUI.Toolbar>
				</MaterialUI.AppBar>
				<CreateChannelDialog
					parentCB={c => {
						this.createChannelDialog = c;
					}}
				/>
			</div>
		);
	}
}
