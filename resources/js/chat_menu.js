import * as helpers from '%{ cb "./helpers.js" }%';

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
		this.channelName = this.channelName.bind(this);
	}
	componentDidMount() {
		helpers.incProgress();
		fetch(
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
	channelName(channel) {
		if (
			channel.Properties.Members.length ==
			this.variant.Properties.Nations.length
		) {
			return "Everyone";
		} else {
			return channel.Properties.Members.join(", ");
		}
	}
	render() {
		return (
			<MaterialUI.ButtonGroup
				style={{ display: "flex" }}
				orientation="vertical"
			>
				{this.state.channels.map(channel => {
					return (
						<MaterialUI.Button key={this.channelName(channel)}>
							{this.channelName(channel)}
						</MaterialUI.Button>
					);
				})}
			</MaterialUI.ButtonGroup>
		);
	}
}
