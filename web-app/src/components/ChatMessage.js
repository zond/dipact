import React from "react";
import * as helpers from "../helpers";

import NationAvatar from "./NationAvatar";
import { Typography } from "@material-ui/core";

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
				style={
					this.selfish
						? {
								display: "flex",
								width: "calc(100%-16px)",
								maxWidth: "960px",
								backgroundColor: "#fff",
								alignItems: "flex-start",
								margin: "8px",
								flexDirection: "row-reverse",
						  }
						: {
								display: "flex",
								width: "calc(100%-16px)",
								maxWidth: "960px",
								backgroundColor: "#fff",
								alignItems: "flex-start",
								margin: "8px",
								flexDirection: "row",
						  }
				}
			>
				<div
					style={
						this.selfish
							? {
									margin: "0px 0px 0px 8px",
							  }
							: {
									margin: "0px 8px 0px 0px",
							  }
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
					style={{
						borderRadius: this.selfish
							? "12px 0px 12px 12px"
							: "0px 12px 12px 12px",
						backgroundColor: this.col + "19",
						display: "flex",
						maxWidth: "calc(100% - 70px)",
						border:
							this.brightness > 128
								? "1px solid " + this.col
								: "none",
						flexDirection: "column",
						padding: "10px",
					}}
				>
					<Typography
						style={{
							fontWeight: "700",
							fontSize: "14px",
							alignSelf: "flex-start",
							textAlign: "left",
							color: "rgba(0, 0, 0, 0.7)",
						}}
					>
						{this.props.name} {this.props.nation}
					</Typography>
					<Typography
						style={{
							alignSelf: "flex-start",
							whiteSpace: "pre-wrap",
							textAlign: "left",
							maxWidth: "100%",
							fontSize: "14px",
						}}
					>
						{helpers.linkify(this.props.text)}
					</Typography>
					<Typography
						style={{
							alignSelf: "flex-end",
							fontSize: "12px",
							dispaly: "table",
							color: "rgba(0, 0, 0, 0.3)",
						}}
					>
						{this.props.undelivered
							? "Sending..."
							: this.props.time}
					</Typography>
				</div>
			</div>
		);
	}
}
