import * as helpers from '%{ cb "/js/helpers.js" }%';
import ChatMessage from '%{ cb "/js/chat_message.js" }%';

export default class ChatChannel extends React.Component {
	constructor(props) {
		super(props);
		this.newAfter = Number.MAX_SAFE_INTEGER;
		if (
			this.props.channel.Properties.NMessagesSince &&
			this.props.channel.Properties.NMessagesSince.Since
		) {
			this.newAfter = Date.parse(
				this.props.channel.Properties.NMessagesSince.Since
			);
		}
		this.state = { messages: [] };
		this.member = this.props.game.Properties.Members.find(e => {
			return e.User.Email == Globals.user.Email;
		});
		this.variant = Globals.variants.find(v => {
			return v.Properties.Name == this.props.game.Properties.Variant;
		});
		this.sendMessage = this.sendMessage.bind(this);
		this.loadMessages = this.loadMessages.bind(this);
		this.phaseResolvedAfter = this.phaseResolvedAfter.bind(this);
		this.messageHandler = this.messageHandler.bind(this);
		this.updateHistoryAndSubscription = this.updateHistoryAndSubscription.bind(
			this
		);
		this.keyPress = this.keyPress.bind(this);
	}
	messageHandler(payload) {
		if (payload.data.message.GameID != this.props.game.Properties.ID) {
			return false;
		}
		if (
			payload.data.message.ChannelMembers.join(",") !=
			this.props.channel.Properties.Members.join(",")
		) {
			return false;
		}
		this.loadMessages(true);
		return true;
	}
	updateHistoryAndSubscription(
		isActive = this.props.isActive && this.props.channel
	) {
		if (isActive) {
			history.pushState(
				"",
				"",
				"/Game/" +
					this.props.game.Properties.ID +
					"/Channel/" +
					this.props.channel.Properties.Members.join(",") +
					"/Messages"
			);
			if (Globals.messaging.subscribe("message", this.messageHandler)) {
				console.log(
					"ChatChannel subscribing to `message` notifications."
				);
			}
		} else {
			if (!this.props.parent.props.parent.dead) {
				history.pushState(
					"",
					"",
					"/Game/" + this.props.game.Properties.ID
				);
			}
			if (Globals.messaging.unsubscribe("message", this.messageHandler)) {
				console.log(
					"ChatChannel unsubscribing from `message` notifications."
				);
			}
		}
	}
	componentDidMount() {
		this.loadMessages().then(this.updateHistoryAndSubscription);
		Globals.backListeners.unshift(this.props.close);
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		this.updateHistoryAndSubscription();
		if (!prevProps.isActive && this.props.isActive) {
			this.loadMessages(true);
		}
	}
	componentWillUnmount() {
		Globals.backListeners = Globals.backListeners.filter(l => {
			return l != this.props.close;
		});
		this.updateHistoryAndSubscription(false);
	}
	sendMessage() {
		if (this.props.createMessageLink) {
			const msg = document.getElementById("chat-channel-input-field")
				.value;
			this.setState(
				{
					messages: this.state.messages.concat([
						{
							Properties: {
								Sender: this.member.Nation,
								Body: msg,
								ID: Math.random(),
								CreatedAt: "" + new Date()
							},
							undelivered: true
						}
					])
				},
				_ => {
					document.getElementById("chat-channel-input-field").value =
						"";
					const messagesEl = document.getElementById("messages");
					messagesEl.scrollTop = messagesEl.scrollHeight;
					helpers
						.safeFetch(
							helpers.createRequest(
								this.props.createMessageLink.URL,
								{
									method: this.props.createMessageLink.Method,
									headers: {
										"Content-Type": "application/json"
									},
									body: JSON.stringify({
										Body: msg,
										ChannelMembers: this.props.channel
											.Properties.Members
									})
								}
							)
						)
						.then(resp =>
							resp.json().then(js => {
								if (
									!this.props.channel.Links.find(l => {
										return l.Rel == "messages";
									})
								) {
									this.props.channel.Links.push({
										Rel: "messages",
										URL:
											"/Game/" +
											this.props.game.Properties.ID +
											"/Channel/" +
											js.Properties.ChannelMembers.join(
												","
											) +
											"/Messages",
										Method: "GET"
									});
								}
								this.loadMessages(true);
							})
						);
				}
			);
		}
	}
	phaseResolvedAfter(phase, message) {
		if (phase.Properties.Resolved) {
			return (
				new Date(Date.parse(phase.Properties.ResolvedAt)).getTime() >
				new Date(Date.parse(message.Properties.CreatedAt)).getTime()
			);
		}
		return true;
	}
	keyPress(e) {
		if (e.keyCode == 13 && !e.shiftKey) {
			this.sendMessage(e.target.value);
		}
	}
	loadMessages(silent = false) {
		let messagesLink = this.props.channel.Links.find(l => {
			return l.Rel == "messages";
		});
		if (messagesLink) {
			if (!silent) {
				helpers.incProgress();
			}
			return helpers
				.safeFetch(helpers.createRequest(messagesLink.URL))
				.then(resp => resp.json())
				.then(js => {
					if (this.props.loaded) {
						this.props.loaded();
					}
					if (!silent) {
						helpers.decProgress();
					}
					js.Properties.reverse();
					let currentPhaseIdx = 0;
					js.Properties.forEach(message => {
						while (
							currentPhaseIdx + 1 < this.props.phases.length &&
							!this.phaseResolvedAfter(
								this.props.phases[currentPhaseIdx],
								message
							)
						) {
							currentPhaseIdx++;
						}
						message.phase = this.props.phases[currentPhaseIdx];
					});
					this.setState({ messages: js.Properties }, _ => {
						const messagesEl = document.getElementById("messages");
						messagesEl.scrollTop = messagesEl.scrollHeight;
					});
					return Promise.resolve({});
				});
		} else {
			return Promise.resolve({});
		}
	}
	render() {
		if (this.props.channel) {
			return (
				<React.Fragment>
					<MaterialUI.ButtonGroup
						orientation="vertical"
						style={{ width: "100%" }}
					>
						<MaterialUI.Button
							onClick={this.props.close}
							style={{
								display: "flex",
								justifyContent: "space-between"
							}}
						>
							<span style={{ display: "flex" }}>
								{helpers.channelName(
									this.props.channel,
									this.variant
								)}
							</span>
							{helpers.createIcon("\ue5cf")}
						</MaterialUI.Button>
					</MaterialUI.ButtonGroup>
					<div
						id="messages"
						style={{
							overflowY: "scroll",
							height: "calc(100% - 56px)",
							maxWidth: "962px",
							margin: "auto",
							width: "100%",
							overflowX: "hidden"
						}}
					>
						{this.state.messages.map((message, idx) => {
							const selfish =
								this.member &&
								this.member.Nation ===
									message.Properties.Sender;
							return (
								<React.Fragment key={message.Properties.ID}>
									{message.phase &&
									(idx == 0 ||
										message.phase.Properties.PhaseOrdinal !=
											this.state.messages[idx - 1].phase
												.Properties.PhaseOrdinal) ? (
										<div
											className={helpers.scopedClass(`
							                             display: flex;
							                             align-items : center;
                                                         justify-content: center;
											`)}
										>
											<MaterialUI.Typography
												color="primary"
												display="block"
												variant="subtitle2"
											>
												-------{" "}
												{helpers.phaseName(
													message.phase
												)}{" "}
												------
											</MaterialUI.Typography>
										</div>
									) : (
										""
									)}
									{message.Properties.CreatedAt &&
									this.newAfter <
										Date.parse(
											message.Properties.CreatedAt
										) &&
									(idx == 0 ||
										this.newAfter >=
											Date.parse(
												this.state.messages[idx - 1]
													.Properties.CreatedAt
											)) ? (
										<div
											className={helpers.scopedClass(`
												justify-content: center;
												width: 100%;
												max-width: 960px;
												display: flex;
												background: repeating-linear-gradient( 45deg, rgba(255,0,0,.1), rgba(255,0,0,0.1) 10px, rgba(255,0,0,0) 10px, rgba(255,0,0,0) 20px )

													`)}
										>
											<MaterialUI.Typography
												variant="subtitle2"
												style={{ color: "#b71c1c" }}
												display="block"
											>
												New messages
											</MaterialUI.Typography>
										</div>
									) : (
										""
									)}
									<ChatMessage
										key={message.Properties.ID}
										name={name}
										undelivered={message.undelivered}
										variant={this.variant}
										nation={message.Properties.Sender}
										text={message.Properties.Body}
										time={helpers.timeStrToDateTime(
											message.Properties.CreatedAt
										)}
										sender={selfish ? "self" : ""}
									/>
								</React.Fragment>
							);
						})}
						{this.props.createMessageLink &&
						!this.props.channel.Properties.Members.find(m => {
							return m == helpers.DiplicitySender;
						}) ? (
							<div
								style={{
									display: "flex",
									alignItems: "flex-start",
									maxWidth: "960px",
									padding: "8px",
									position: "sticky",
									bottom: "0px",
									backgroundColor: "white"
								}}
							>
								<MaterialUI.TextField
									id="chat-channel-input-field"
									multiline
									rows="2"
									style={{ flexGrow: 100 }}
									label="Message"
									variant="outlined"
									onKeyDown={this.keyPress}
								/>
								<MaterialUI.IconButton
									onClick={this.sendMessage}
									color="primary"
								>
									{helpers.createIcon("\ue163")}
								</MaterialUI.IconButton>
							</div>
						) : (
							""
						)}
					</div>
				</React.Fragment>
			);
		} else {
			return "";
		}
	}
}
