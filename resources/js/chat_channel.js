import * as helpers from '%{ cb "/js/helpers.js" }%';
import ChatMessage from '%{ cb "/js/chat_message.js" }%';

export default class ChatChannel extends React.Component {
	constructor(props) {
		super(props);
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
		this.updateHistoryAndSubscription = this.updateHistoryAndSubscription.bind(
			this
		);
	}
	updateHistoryAndSubscription(isActive = this.props.isActive) {
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
			Globals.messaging.subscribe("message", payload => {
				if (
					payload.data.message.GameID != this.props.game.Properties.ID
				) {
					return false;
				}
				if (
					payload.data.message.ChannelMembers.join(",") !=
					this.props.channel.Properties.Members.join(",")
				) {
					return false;
				}
				this.loadMessages();
				return true;
			});
			console.log("ChatChannel subscribing to `message` notifications.");
		} else {
			if (!this.props.parent.props.parent.dead) {
				history.pushState(
					"",
					"",
					"/Game/" + this.props.game.Properties.ID
				);
			}
			Globals.messaging.unsubscribe("message");
			console.log(
				"ChatChannel unsubscribing from `message` notifications."
			);
		}
	}
	componentDidMount() {
		this.loadMessages().then(this.updateHistoryAndSubscription);
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		this.updateHistoryAndSubscription();
	}
	componentWillUnmount() {
		this.updateHistoryAndSubscription(false);
	}
	sendMessage() {
		if (this.props.createMessageLink) {
			helpers.incProgress();
			helpers
				.safeFetch(
					helpers.createRequest(this.props.createMessageLink.URL, {
						method: this.props.createMessageLink.Method,
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							Body: document.getElementById(
								"chat-channel-input-field"
							).value,
							ChannelMembers: this.props.channel.Properties
								.Members
						})
					})
				)
				.then(_ => {
					helpers.decProgress();
					document.getElementById("chat-channel-input-field").value =
						"";
					this.loadMessages();
				});
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
	loadMessages() {
		let messagesLink = this.props.channel.Links.find(l => {
			return l.Rel == "messages";
		});
		if (messagesLink) {
			helpers.incProgress();
			return helpers
				.safeFetch(helpers.createRequest(messagesLink.URL))
				.then(resp => resp.json())
				.then(js => {
					helpers.decProgress();
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
						let msgEl = document.getElementById("messages");
						msgEl.scrollTop = msgEl.scrollHeight;
						document
							.getElementById("chat-channel-input-field")
							.focus();
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
								{this.props.channelName}
							</span>
							{helpers.createIcon("\ue5cf")}
						</MaterialUI.Button>
					</MaterialUI.ButtonGroup>
					<div
						id="messages"
						style={{
							overflowY: "scroll",
							height: "calc(100% - 56px)",
							width: "100%"
						}}
					>
						{this.state.messages.map(message => {
							const selfish =
								this.member &&
								this.member.Nation ===
									message.Properties.Sender;
							return (
								<ChatMessage
									name={name}
									variant={this.variant}
									nation={message.Properties.Sender}
									text={message.Properties.Body}
									phase={message.phase}
									time={helpers.timeStrToDateTime(
										message.Properties.CreatedAt
									)}
									key={message.Properties.ID}
									sender={selfish ? "self" : ""}
								/>
							);
						})}
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
							/>
							<MaterialUI.IconButton
								onClick={this.sendMessage}
								color="primary"
							>
								{helpers.createIcon("\ue163")}
							</MaterialUI.IconButton>
						</div>
					</div>
				</React.Fragment>
			);
		} else {
			return "";
		}
	}
}
