import NationAvatar from '%{ cb "/js/nation_avatar.js"}%';

export default class ChatMessage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const selfish = this.props.sender === "self";

		const messagecontainerStyle = {
			display: "flex",
			width: "calc(100%-16px)",
			maxWidth: "960px",
			backgroundColor: "#fff",
			alignItems: "flex-start",
			margin: "8px",
			flexDirection: "row"
		};

		const messagecontainerselfStyle = {
			display: "flex",
			width: "calc(100%-16px)",
			maxWidth: "960px",
			backgroundColor: "#fff",
			alignItems: "flex-start",
			margin: "8px",
			flexDirection: "row-reverse"
		};

		const avatarStyle = { margin: "0px 8px 0px 0px" };
		const avatarselfStyle = { margin: "0px 0px 0px 8px" };

		const avatarimageStyle = {
			borderRadius: "50%",
			backgroundSize: "cover",
			height: "40px",
			width: "40px",
			backgroundColor: "#000"
		};

		{
			/* TODO: remove when flags are imported */
		}

		const textballoonStyle = {
			backgroundColor: "rgba(\n    255,\n    0,\n    0,\n    0.1\n  )",
			borderRadius: "0px 12px 12px 12px",
			display: "flex",
			flexDirection: "column",
			padding: "10px"
		};

		const textballoonselfStyle = {
			borderRadius: "12px 0px 12px 12px",
			backgroundColor: "rgba(0,148,71,0.1)",
			display: "flex",
			flexDirection: "column",
			padding: "10px"
		};

		const textballoontitleStyle = {
			fontWeight: "700",
			fontSize: "14px",
			alignSelf: "flex-start",
			textAlign: "left",
			color: "rgba(0, 0, 0, 0.7)"
		};

		const textballoontextStyle = {
			alignSelf: "flex-start",
			textAlign: "left",
			fontSize: "14px",
		};

		const textballoondateStyle = {
			fontSize: "12px",
			display: "table",
			alignSelf: "flex-end",
			color: "rgba(0, 0, 0, 0.3)"
		};

		return (
			<div
				style={
					selfish ? messagecontainerselfStyle : messagecontainerStyle
				}
			>
				<div style={selfish ? avatarselfStyle : avatarStyle}>
					<NationAvatar
						nation={this.props.nation}
						variant={this.props.variant}
					/>
				</div>
				<div style={selfish ? textballoonselfStyle : textballoonStyle}>
					<MaterialUI.Typography style={textballoontitleStyle}>
						{this.props.name} {this.props.nation}
					</MaterialUI.Typography>
					<MaterialUI.Typography style={textballoontextStyle}>{this.props.text}</MaterialUI.Typography>
					<MaterialUI.Typography style={textballoondateStyle}>{this.props.time}</MaterialUI.Typography>
				</div>
			</div>
		);
	}
}
