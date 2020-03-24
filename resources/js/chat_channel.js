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
					this.setState({ messages: js.Properties });
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
							<div>{this.props.channelName}</div>
							{helpers.createIcon("\ue5cf")}
						</MaterialUI.Button>
					</MaterialUI.ButtonGroup>
					{this.state.messages.map(message => {
						return (
							<MaterialUI.ExpansionPanel
								key={message.Properties.ID}
							>
								<MaterialUI.ExpansionPanelSummary
									className="min-width-summary"
									expandIcon={helpers.createIcon("\ue88e")}
								>
									<MaterialUI.Grid container>
										<MaterialUI.Grid
											key="sender"
											item
											xs={2}
										>
											{
												this.props.flags[
													message.Properties.Sender
												].el
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
									<MaterialUI.Paper elevation={3}>
										...
									</MaterialUI.Paper>
								</MaterialUI.ExpansionPanelDetails>
							</MaterialUI.ExpansionPanel>
						);
					})}
				</React.Fragment>
			);
		} else {
			return "";
		}
	}
}
