/* eslint-disable no-restricted-globals */
import React from "react";
import * as helpers from "../helpers";
import {
	Dialog,
	Divider,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
} from "@material-ui/core";
import Globals from "../Globals";
import {
	CloseIcon,
	WarningIcon,
} from "../icons";
//import ColdWarPath from "../static/img/coldwar.png";
import colorModePath from "../static/img/colourmode.png";

export default class NewsDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			activeItem: 0,
			newsItems: [
				{
					header: "New feature: Coloured provinces",
					subheader: "Really see you've conquered the map",
					icon: false,
					content: (
						<React.Fragment>
							<Typography variant="h6" style={{ margin: "0px 0px 8px 0px" }}>
								Beta feature: Coloured provinces
							</Typography>
							<Typography
								variant="body2"
								style={{ margin: "0px 0px 16px 0px" }}
							>
								Provinces without SC can now be coloured,
								connecting the SCs you've conquered. <br />
								It's aesthetics and doesn't
								affect the gameplay.
								<br />
								While in Beta, this setting is device-specific.
								<br /><br />
								Below is the effect off (left) or on (right).
								<img
									src={colorModePath}
									style={{ width: "100%", maxWidth: "400px" }}
								/>
								<br />
								We always look for feedback in the <a href="https://discord.com/invite/bu3JxYc" target="_blank">Chat</a> or <a href="https://groups.google.com/g/diplicity-talk" target="_blank">Forum</a>.
							</Typography>
						</React.Fragment>
					),
				},
				{
					header: "New North Sea Wars map",
					subheader: "Redesign of the variant",
					icon: false,
					content: (
						<React.Fragment>
							<Typography variant="h6" style={{ margin: "0px 0px 8px 0px" }}>
								New map: North Sea Wars
							</Typography>
							<Typography
								variant="body2"
								style={{ margin: "0px 0px 16px 0px" }}
							>
								In line with updating all maps to a newer look, we released a
								new version of the North Sea Wars map. It's not a new variant,
								but a reskin:
								<br />
								<img
									src="https://diplicity-engine.appspot.com/Variant/North%20Sea%20Wars/Map.svg"
									style={{ maxWidth: "400px" }}
								/>
								<br />
								This might be a nice opportunity to start a new game on this
								map!
							</Typography>
						</React.Fragment>
					),
				},
			],
		};
		this.setForumMail = this.setForumMail.bind(this);
		this.close = this.close.bind(this);
		this.updateInterval = null;
		this.ff = this.ff.bind(this);
	}
	setForumMail(fm) {
		this.setState((state, props) => {
			state = Object.assign({}, state);
			state.newsItems.push({
				header: <span>New Forum Post:</span>,
				subheader: <span>{fm.Properties.Subject}</span>,
				content: (
					<React.Fragment>
						<Typography variant="h6" style={{}}>
							Latest forum post
						</Typography>
						<pre style={{ whiteSpace: "pre-wrap" }}>
							<Typography variant="body2">
								{fm.Properties.Subject}
								{"\n\n"}
								{fm.Properties.Body}
							</Typography>
						</pre>
						<Typography variant="body2" style={{ margin: "0px 0px 12px 0px" }}>
							<a
								href="https://groups.google.com/g/diplicity-talk"
								target="_blank"
								rel="noreferrer"
							>
								Visit the forum
							</a>
						</Typography>
					</React.Fragment>
				),
			});
			return state;
		});
	}
	ff(ev) {
		if (ev) ev.stopPropagation();
		this.setState({
			activeItem: (this.state.activeItem + 1) % this.state.newsItems.length,
		});
	}
	componentDidMount() {
		this.updateInterval = setInterval(this.ff, 10000);
		if (Globals.latestForumMail) {
			setTimeout((_) => {
				this.setForumMail(Globals.latestForumMail);
			}, 50);
		} else {
			Globals.onNewForumMail = (fm) => {
				this.setForumMail(fm);
			};
		}
	}
	componentWillUnmount() {
		if (this.updateInterval) {
			clearInterval(this.updateInterval);
		}
	}
	close() {
		helpers.unback(this.close);
		this.setState({ open: false });
	}
	render() {
		if (this.state.open) {
			return (
				<Dialog
					onEntered={helpers.genOnback(this.close)}
					open={this.state.open}
					fullScreen
					onClose={this.close}
				>
					<AppBar>
						<Toolbar>
							<IconButton
								edge="start"
								color="inherit"
								onClick={(_) => {
									this.setState({ open: false });
								}}
								aria-label="close"
							>
								<CloseIcon />
							</IconButton>
							<Typography variant="h6" style={{ paddingLeft: "16px" }}>
								News
							</Typography>
						</Toolbar>
					</AppBar>
					<div
						style={{
							padding: "0x",
							margin: "0px",
							maxWidth: "940px",
							marginLeft: "auto",
							marginRight: "auto",
						}}
					>
						<div
							style={{
								padding: "16px",
								marginTop: "56px",
							}}
						>
							{this.state.newsItems.map((item, idx) => {
								return (
									<React.Fragment key={idx}>
										{item.content}
										<Divider style={{ margin: "16px 0 12px 0" }} />
									</React.Fragment>
								);
							})}
						</div>
						<div
							style={{
								backgroundImage: "url('../static/img/soldiers.svg'",
								height: "72px",
								top: "auto",
								bottom: "0px",
							}}
						></div>
					</div>
				</Dialog>
			);
		} else {
			return (
				<div
					style={{
						height: "52px",
						margin: "0px auto 6px auto",
						maxWidth: "940px",
					}}
				>
					<div
						style={{
							borderRadius: "3px",
							display: "flex",
							alignItems: "flex-start",
							padding: "6px 8px",
							margin: "8px 16px 0px 16px",
							backgroundColor: this.state.newsItems[this.state.activeItem]
								.background
								? null
								: "rgb(255, 244, 229)",
							backgroundSize: "cover",
							backgroundImage: this.state.newsItems[this.state.activeItem]
								.background
								? "url(" +
								  this.state.newsItems[this.state.activeItem].background +
								  ")"
								: null,
						}}
						onClick={(_) => {
							this.setState({ open: true });
						}}
					>
						<div style={{ width: "calc(100% - 48px)" }}>
							<Typography
								variant="body1"
								style={{
									color: "rgb(97, 26, 21)",
									fontWeight: "500",
								}}
								textoverflow="ellipsis"
								noWrap
							>
								{this.state.newsItems[this.state.activeItem].header}
							</Typography>

							<Typography
								variant="body2"
								style={{ color: "rgb(97, 26, 21)" }}
								textoverflow="ellipsis"
								noWrap
							>
								{this.state.newsItems[this.state.activeItem].subheader}
							</Typography>
						</div>
					</div>
				</div>
			);
		}
	}
}
