import * as helpers from '%{ cb "./helpers.js" }%';

import ChatChannel from '%{ cb "./chat_channel.js" }%';

export default class ChatMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = { channels: [], activeChannel: null, channelOpen: false };
		this.member = this.props.game.Properties.Members.find(e => {
			return e.User.Email == Globals.user.Email;
		});
		this.variant = Globals.variants.find(v => {
			return v.Properties.Name == this.props.game.Properties.Variant;
		});
		this.openChannel = this.openChannel.bind(this);
		this.closeChannel = this.closeChannel.bind(this);
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
					this.setState({ channels: js.Properties });
				});
		}
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
								onClick={_ => {
									this.openChannel(channel);
								}}
								key={helpers.channelName(channel, this.variant)}
							>
								<MaterialUI.Typography>
									{helpers.channelName(channel, this.variant)}
								</MaterialUI.Typography>
							</MaterialUI.Button>
						);
					})}
				</MaterialUI.ButtonGroup>
			</div>
		);
	}
}
