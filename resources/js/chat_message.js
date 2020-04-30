import * as helpers from '%{ cb "/js/helpers.js" }%';

import NationAvatar from '%{ cb "/js/nation_avatar.js"}%';

export default class ChatMessage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.selfish = this.props.sender === "self";
		this.col = helpers.natCol(this.props.nation, this.props.variant);
		this.brightness = helpers.brightnessByColor(this.col);
	}

	render() {
		return (
			<div
				className={
					this.selfish
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
						this.selfish
							? helpers.scopedClass(`
						margin: 0px 0px 0px 8px;
						`)
							: helpers.scopedClass(`
						margin: 0px 8px 0px 0px;
						`)
					}
				>
					<NationAvatar
						game={this.props.game}
						onNewGameState={this.props.onNewGameState}
						gameState={this.props.gameState}
						nation={this.props.nation}
						variant={this.props.variant}
					/>
				</div>
				<div
					className={helpers.scopedClass(
						`
			border-radius: ` +
							(this.selfish
								? "12px 0px 12px 12px;"
								: "0px 12px 12px 12px;") +
							`
			background-color: ` +
							this.col +
							`19;
			display: flex;
			border: ` +
							(this.brightness > 128
								? `1px solid ` + this.col + `;`
								: `none;`) +
							`
			flex-direction: column;
			padding: 10px;
						`
					)}
				>
					<MaterialUI.Typography
						className={helpers.scopedClass(`
		                                                font-weight: 700;
		                                                font-size: 14px;
		                                                align-self: flex-start;
		                                                text-align: left;
		                                                color: rgba(0, 0, 0, 0.7);`)}
					>
						{this.props.name} {this.props.nation}
					</MaterialUI.Typography>
					<MaterialUI.Typography
						className={helpers.scopedClass(`
		                                                align-self: flex-start;
		                                                text-align: left;
		                                                font-size: 14px;`)}
					>
						{this.props.text}
					</MaterialUI.Typography>
					<MaterialUI.Typography
						className={helpers.scopedClass(`
		                                                font-size: 12px;
		                                                display: table;
		                                                align-self: flex-end;
		                                                color: rgba(0, 0, 0, 0.3);`)}
					>
						{this.props.undelivered
							? "Sending..."
							: this.props.time}
					</MaterialUI.Typography>
				</div>
			</div>
		);
	}
}
