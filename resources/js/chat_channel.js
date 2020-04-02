import * as helpers from '%{ cb "/js/helpers.js" }%';
import ChatMessage from '%{ cb "/js/chat_message.js" }%';
import NationAvatar from '%{ cb "/js/nation_avatar.js" }%';

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
		this.messagMeta = this.messageMeta.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.loadMessages = this.loadMessages.bind(this);
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
			history.pushState("", "", "/Game/" + this.props.game.Properties.ID);
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
	messageMeta(message) {
		let d = new Date(Date.parse(message.Properties.CreatedAt));
		let phase = this.props.phases.find(phase => {
			return (
				!phase.Properties.Resolved ||
				new Date(Date.parse(phase.Properties.ResolvedAt)).getTime() >
					d.getTime()
			);
		});
		if (!phase) {
			phase = this.props.phases[this.props.phases.length - 1];
		}
		return (
			<MaterialUI.TableContainer component={MaterialUI.Paper}>
				<MaterialUI.Table>
					<MaterialUI.TableBody>
						<MaterialUI.TableRow>
							<MaterialUI.TableCell>
								<MaterialUI.Typography>
									From
								</MaterialUI.Typography>
							</MaterialUI.TableCell>
							<MaterialUI.TableCell>
								<MaterialUI.Typography>
									{message.Properties.Sender}
									{" ("}
									{
										this.props.game.Properties.Members.find(
											member => {
												return (
													member.Nation ==
													message.Properties.Sender
												);
											}
										).User.Name
									}
									)
								</MaterialUI.Typography>
							</MaterialUI.TableCell>
						</MaterialUI.TableRow>
						<MaterialUI.TableRow>
							<MaterialUI.TableCell>
								<MaterialUI.Typography>
									To
								</MaterialUI.Typography>
							</MaterialUI.TableCell>
							<MaterialUI.TableCell>
								<MaterialUI.Typography>
									{message.Properties.ChannelMembers.join(
										", "
									)}
								</MaterialUI.Typography>
							</MaterialUI.TableCell>
						</MaterialUI.TableRow>
						<MaterialUI.TableRow>
							<MaterialUI.TableCell>
								<MaterialUI.Typography>
									Sent at
								</MaterialUI.Typography>
							</MaterialUI.TableCell>
							<MaterialUI.TableCell>
								<MaterialUI.Typography>
									{helpers.timeStrToDateTime(
										message.Properties.CreatedAt
									)}
								</MaterialUI.Typography>
							</MaterialUI.TableCell>
						</MaterialUI.TableRow>
						<MaterialUI.TableRow>
							<MaterialUI.TableCell>
								<MaterialUI.Typography>
									During
								</MaterialUI.Typography>
							</MaterialUI.TableCell>
							<MaterialUI.TableCell>
								<MaterialUI.Typography>
									{helpers.phaseName(phase)}
								</MaterialUI.Typography>
							</MaterialUI.TableCell>
						</MaterialUI.TableRow>
					</MaterialUI.TableBody>
				</MaterialUI.Table>
			</MaterialUI.TableContainer>
		);
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
								this.member.Nation ===
								message.Properties.Sender;
							return (
								<ChatMessage
									name={name}
									variant={this.props.game.Properties.Variant}
									nation={message.Properties.Sender}
									text={message.Properties.Body}
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
