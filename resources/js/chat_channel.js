import * as helpers from '%{ cb "./helpers.js" }%';

export default class ChatChannel extends React.Component {
	constructor(props) {
		super(props);
		this.member = this.props.game.Properties.Members.find(e => {
			return e.User.Email == Globals.user.Email;
		});
		this.variant = Globals.variants.find(v => {
			return v.Properties.Name == this.props.game.Properties.Variant;
		});
		this.channelName = this.channelName.bind(this);
	}
	channelName() {
		if (
			this.props.channel.Properties.Members.length ==
			this.variant.Properties.Nations.length
		) {
			return "Everyone";
		} else {
			return this.props.channel.Properties.Members.join(", ");
		}
	}
	render() {
		return (
			<MaterialUI.ExpansionPanel>
				<MaterialUI.ExpansionPanelSummary
					className="channel-summary"
					expandIcon={helpers.createIcon("\ue5cf")}
				>
					{this.channelName()}
				</MaterialUI.ExpansionPanelSummary>
				<MaterialUI.ExpansionPanelDetails
					style={{ paddingRight: "0.3em", paddingLeft: "0.3em" }}
				>
					<MaterialUI.Paper elevation={3}>
						<MaterialUI.Grid container style={{ margin: "0.3em" }}>
							...
						</MaterialUI.Grid>
					</MaterialUI.Paper>
				</MaterialUI.ExpansionPanelDetails>
			</MaterialUI.ExpansionPanel>
		);
	}
}
