import * as helpers from '%{ cb "./helpers.js" }%';

import ChatChannel from '%{ cb "./chat_channel.js" }%';

export default class ChatMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = { channels: [] };
		this.member = this.props.game.Properties.Members.find(e => {
			return e.User.Email == Globals.user.Email;
		});
		this.variant = Globals.variants.find(v => {
			return v.Properties.Name == this.props.game.Properties.Variant;
		});
	}
	componentDidMount() {
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest(
					this.props.game.Links.find(l => {
						return l.Rel == "channels";
					}).URL
				)
			)
			.then(resp => resp.json())
			.then(js => {
				helpers.decProgress();
				this.setState({ channels: js.Properties });
			});
	}
	handleNewMemberChange(e) {
		console.log(e);
	}
	render() {
		return this.state.channels
			.map(channel => {
				return (
					<ChatChannel
						key={channel.Properties.Members.join(",")}
						channel={channel}
						game={this.props.game}
					/>
				);
			})
			.concat(
				<MaterialUI.ExpansionPanel key="new-channel">
					<MaterialUI.ExpansionPanelSummary
						className="min-width-summary"
						expandIcon={helpers.createIcon("\ue5cf")}
					>
						{helpers.createIcon("\ue02e")}
					</MaterialUI.ExpansionPanelSummary>
					<MaterialUI.ExpansionPanelDetails
						style={{ paddingRight: "0.3em", paddingLeft: "0.3em" }}
					>
						<MaterialUI.Paper
							elevation={3}
							style={{ width: "100%" }}
						>
							<MaterialUI.FormControl component="fieldset">
								<MaterialUI.FormLabel component="legend">
									Members
								</MaterialUI.FormLabel>
								<MaterialUI.FormGroup>
									{this.variant.Properties.Nations.map(
										nation => {
											return (
												<MaterialUI.FormControlLabel
													key={nation}
													control={
														<MaterialUI.Checkbox
															nation={nation}
															onChange={
																this
																	.handleNewMemberChange
															}
														/>
													}
													label={nation}
												/>
											);
										}
									)}
								</MaterialUI.FormGroup>
							</MaterialUI.FormControl>
						</MaterialUI.Paper>
					</MaterialUI.ExpansionPanelDetails>
				</MaterialUI.ExpansionPanel>
			);
	}
}
