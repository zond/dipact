import * as helpers from '%{ cb "./helpers.js" }%';

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
	componentDidMount() {
		let messagesLink = this.props.channel.Links.find(l => {
			return l.Rel == "messages";
		});
		if (messagesLink) {
			helpers.incProgress();
			helpers
				.safeFetch(helpers.createRequest(messagesLink.URL))
				.then(resp => resp.json())
				.then(js => {
					helpers.decProgress();
					this.setState({ messages: js.Properties }, _ => {
						let msgEl = document.getElementById("messages");
						msgEl.scrollTop = msgEl.scrollHeight;
						document.getElementById("input_field").focus();
					});
				});
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
							height: "calc(100% - 40px)",
							width: "100%"
						}}
					>
						{this.state.messages.map(message => {
							return (
								<MaterialUI.ExpansionPanel
									key={message.Properties.ID}
								>
									<MaterialUI.ExpansionPanelSummary
										className="min-width-summary"
										expandIcon={helpers.createIcon(
											"\ue88e"
										)}
									>
										<MaterialUI.Grid container>
											<MaterialUI.Grid
												key="sender"
												item
												xs={2}
											>
												{
													this.props.flags[
														message.Properties
															.Sender
													]
												}
											</MaterialUI.Grid>
											<MaterialUI.Grid
												key="body"
												item
												xs={10}
											>
												{message.Properties.Body}
											</MaterialUI.Grid>
										</MaterialUI.Grid>
									</MaterialUI.ExpansionPanelSummary>
									<MaterialUI.ExpansionPanelDetails
										style={{
											paddingRight: "0.3em",
											paddingLeft: "0.3em"
										}}
									>
										{this.messageMeta(message)}
									</MaterialUI.ExpansionPanelDetails>
								</MaterialUI.ExpansionPanel>
							);
						})}
						<div style={{ display: "flex" }}>
							<MaterialUI.TextField
								id="input_field"
								multiline
								rows="3"
								style={{ flexGrow: 100 }}
								label="Message"
							/>
							<MaterialUI.IconButton>
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
