import * as helpers from '%{ cb "/js/helpers.js" }%';

import ChatChannel from '%{ cb "/js/chat_channel.js" }%';

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
		this.nationAbbreviations = {};
		this.variant.Properties.Nations.forEach(nation => {
			for (let idx = 0; idx < nation.length; idx++) {
				let matchingNations = this.variant.Properties.Nations.filter(
					otherNation => {
						return otherNation.indexOf(nation.slice(0, idx)) == 0;
					}
				).length;
				if (matchingNations == 1) {
					this.nationAbbreviations[nation] = nation.slice(0, idx);
					break;
				}
			}
		});
		this.flags = {};
		this.variant.Properties.Nations.forEach(nation => {
			let flagLink = this.variant.Links.find(l => {
				return l.Rel == "flag-" + nation;
			});
			if (flagLink) {
				this.flags[nation] = (
					<MaterialUI.Avatar
						className="avatar"
						key={nation}
						alt={nation}
						src={flagLink.URL}
					/>
				);
			} else {
				this.flags[nation] = (
					<MaterialUI.Avatar
						className="avatar"
						key={nation}
						alt={nation}
					>
						{this.nationAbbreviations[nation]}
					</MaterialUI.Avatar>
				);
			}
		});
		this.contrasts = (_ => {
			let m = dippyMap($("body"));
			return m.contrasts;
		})();
		this.openChannel = this.openChannel.bind(this);
		this.closeChannel = this.closeChannel.bind(this);
		this.channelName = this.channelName.bind(this);
		this.natCol = this.natCol.bind(this);
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
		return this.contrasts[this.variant.Properties.Nations.indexOf(nat)];
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
					className="avatar"
					key="Everyone"
					alt="Everyone"
					src="/static/un_logo.svg"
				/>
			);
		}
		return channel.Properties.Members.map(member => {
			return this.flags[member];
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
			<div style={{ position: "relative", height: "100%" }}>
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
							flags={this.flags}
							channel={this.state.activeChannel}
							close={this.closeChannel}
						/>
					</div>
				</MaterialUI.Slide>
				<MaterialUI.ButtonGroup
					orientation="vertical"
					style={{ width: "100%" }}
				>
					{this.state.channels.map(channel => {
						return (
							<MaterialUI.Button
								style={{
									display: "flex",
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
			</div>
		);
	}
}
