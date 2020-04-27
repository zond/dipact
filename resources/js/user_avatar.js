import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class UserAvatar extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<MaterialUI.Avatar
				className={helpers.avatarClass}
				alt={this.props.user.Name}
				src={this.props.user.Picture}
				style={{ marginRight: "16px" }}
			/>
		);
	}
}
