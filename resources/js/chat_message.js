import * as helpers from '%{ cb "/js/helpers.js" }%';

import NationAvatar from '%{ cb "/js/nation_avatar.js"}%';

export default class ChatMessage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const selfish = this.props.sender === "self";

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
			fontSize: "14px"
		};

		const textballoondateStyle = {
			fontSize: "12px",
			display: "table",
			alignSelf: "flex-end",
			color: "rgba(0, 0, 0, 0.3)"
		};

		return (
			<div
				className={
					selfish
						? helpers.scopedClass(`
				display: flex;
				width: calc(100%-16px);
				max-width: 960px;
				background-color: #fff;
				align-items: flex-start;
				margin: 8px;
				flex-direction: row-reverse;
				`)
						: helpers.scopedClass(`
				display: flex;
				width: calc(100%-16px);
				max-width: 960px;
				background-color: #fff;
				align-items: flex-start;
				margin: 8px;
				flex-direction: row;
				`)
				}
			>
				<div
					className={
						selfish
							? helpers.scopedClass(`
						margin: 0px 0px 0px 8px;
						`)
							: helpers.scopedClass(`
						margin: 0px 8px 0px 0px;
						`)
					}
				>
					<NationAvatar
						nation={this.props.nation}
						variant={this.props.variant}
					/>
				</div>
				<div
					className={
						selfish
							? helpers.scopedClass(`
			border-radius: 12px 0px 12px 12px;
			background-color: rgba(0,148,71,0.1);
			display: flex;
			flex-direction: column;
			padding: 10px;
						`)
							: helpers.scopedClass(`
			border-radius: 0px 12px 12px 12px;
			background-color: rgba(255,0,0,0.1);
			display: flex;
			flex-direction: column;
			padding: 10px;
						`)
					}
				>
					<MaterialUI.Typography style={textballoontitleStyle}>
						{this.props.name} {this.props.nation}
					</MaterialUI.Typography>
					<MaterialUI.Typography style={textballoontextStyle}>
						{this.props.text}
					</MaterialUI.Typography>
					<MaterialUI.Typography style={textballoondateStyle}>
						{this.props.time}
					</MaterialUI.Typography>
				</div>
			</div>
		);
	}
}
