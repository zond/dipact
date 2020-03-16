import * as helpers from '%{ cb "./helpers.js" }%';

export default class Game extends React.Component {
	constructor(props) {
		super(props);
		this.member = props.game.Properties.Members.find(e => {
			return e.User.Email == this.props.user.Email;
		});
	}
	render() {
		return (
			<MaterialUI.AppBar position="static">
				<MaterialUI.Toolbar
					style={{ display: "flex", justifyContent: "space-between" }}
				>
					<MaterialUI.IconButton onClick={this.props.close}>
						{helpers.createIcon("\ue5cd")}
					</MaterialUI.IconButton>
					<MaterialUI.IconButton>
						{helpers.createIcon("\ue0b7")}
					</MaterialUI.IconButton>
					<MaterialUI.IconButton>
						{helpers.createIcon("\ue8b8")}
					</MaterialUI.IconButton>
					<MaterialUI.IconButton>
						{helpers.createIcon("\ue86c")}
					</MaterialUI.IconButton>
				</MaterialUI.Toolbar>
			</MaterialUI.AppBar>
		);
	}
}
