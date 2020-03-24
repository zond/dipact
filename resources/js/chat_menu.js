import * as helpers from '%{ cb "./helpers.js" }%';

import ChatChannel from '%{ cb "./chat_channel.js" }%';

export default class ChatMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			channels: [],
			activeChannel: null,
			channelOpen: false,
			flags: {}
		};
		this.member = this.props.game.Properties.Members.find(e => {
			return e.User.Email == Globals.user.Email;
		});
		this.variant = Globals.variants.find(v => {
			return v.Properties.Name == this.props.game.Properties.Variant;
		});
		this.nationAbbreviations = {};
		this.variant.Properties.Nations.forEach(nation => {
			let minUniqueAbbreviationLength = 1;
			this.variant.Properties.Nations.forEach(otherNation => {
				if (nation == otherNation) {
					return;
				}
				for (
					let idx = 0;
					idx < otherNation.length &&
					idx < nation.length &&
					otherNation[idx] == nation[idx];
					idx++
				) {
					if (minUniqueAbbreviationLength < idx + 1) {
						minUniqueAbbreviationLength = idx + 1;
					}
				}
			});
			this.nationAbbreviations[nation] = nation.slice(
				0,
				minUniqueAbbreviationLength
			);
		});
		this.openChannel = this.openChannel.bind(this);
		this.closeChannel = this.closeChannel.bind(this);
		this.channelName = this.channelName.bind(this);
		this.natCol = this.natCol.bind(this);
		this.contrasts = (_ => {
			let m = dippyMap($("body"));
			return m.contrasts;
		})();
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
				<MaterialUI.Tooltip key="Everyone" title="Everyone">
					<span
						style={{
							paddingTop: "5px",
							paddingLeft: "3px",
							paddingRight: "3px",
							paddingBottom: "0px"
						}}
						className="chat-member-icon"
					>
						<object
							data="/static/un_logo.svg"
							type="image/svg+xml"
						/>
					</span>
				</MaterialUI.Tooltip>
			);
		}
		return channel.Properties.Members.map(member => {
			return this.state.flags[member].el;
		});
	}
	componentDidMount() {
		let channelLink = this.props.game.Links.find(l => {
			return l.Rel == "channels";
		});
		if (channelLink) {
			helpers.incProgress();
			let promises = [
				helpers
					.safeFetch(helpers.createRequest(channelLink.URL))
					.then(resp => resp.json()),
				Promise.all(
					this.variant.Properties.Nations.map(nation => {
						let flagLink = this.variant.Links.find(l => {
							return l.Rel == "flag-" + nation;
						});
						if (flagLink) {
							return helpers.memoize(flagLink.URL, _ => {
								return helpers
									.safeFetch(
										helpers.createRequest(flagLink.URL)
									)
									.then(resp => resp.text())
									.then(svg => {
										let el = (
											<MaterialUI.Tooltip
												key={nation}
												title={nation}
											>
												<span
													className="chat-member-icon"
													dangerouslySetInnerHTML={{
														__html: svg
													}}
												/>
											</MaterialUI.Tooltip>
										);
										return {
											el: el,
											nation: nation
										};
									});
							});
						} else {
							return Promise.resolve({
								el: (
									<MaterialUI.Tooltip
										key={nation}
										title={nation}
									>
										<span
											className="chat-member-icon"
											style={{
												padding: "2px",
												backgroundColor: this.natCol(
													nation
												)
											}}
										>
											{this.nationAbbreviations[nation]}
										</span>
									</MaterialUI.Tooltip>
								),
								nation: nation
							});
						}
					})
				)
			];
			Promise.all(promises).then(values => {
				helpers.decProgress();
				let channels = values[0];
				let flagData = values[1];
				let flags = {};
				flagData.forEach(d => {
					flags[d.nation] = d;
				});
				this.setState({ channels: channels.Properties, flags: flags });
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
							channelName={this.channelName(
								this.state.activeChannel
							)}
							flags={this.state.flags}
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
