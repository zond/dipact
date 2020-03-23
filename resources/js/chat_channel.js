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
	}
	render() {
		if (this.props.channel) {
			return (
				<MaterialUI.ButtonGroup
					orientation="vertical"
					style={{ width: "100%" }}
				>
					<MaterialUI.Button onClick={this.props.close}>
						<MaterialUI.Typography style={{ flexGrow: 1 }}>
							{helpers.channelName(
								this.props.channel,
								this.variant
							)}
						</MaterialUI.Typography>
						{helpers.createIcon("\ue5cf")}
					</MaterialUI.Button>
				</MaterialUI.ButtonGroup>
			);
		} else {
			return "";
		}
	}
}
