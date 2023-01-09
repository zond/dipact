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
	Link,
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
					header: "New variant released: Unconstitutional",
					subheader: "Fight for America in this alternative-history variant",
					icon: false,
					content: (
						<React.Fragment>
							<Typography variant="h6" style={{ margin: "0px 0px 8px 0px" }}>
								Tournament announcement: Nexus CW5
							</Typography>
							<Typography
								variant="body2"
								paragraph
							>
								Today, we released a new 5 player variant called Unconstitutional.
							</Typography>
							<Typography
								variant="body2"
								paragraph
							>
								This is an alternative history variant where the US constitution was not ratified (which nearly happened). Operating under the weak Articles of Confederation, States keep their conflicting land claims and border disputes turn into armed conflict. Former slaves control Haiti, and inhabitants of New Orleans, Saint Louis and the Turks and Cacois oppose annexation by the US. Federal government ceases to function, many States have seceded and two groups of Native American tribes, the Western and Muskogee Confederacy, are warning the Americans.
							</Typography>
							<Typography
								variant="body2"
								paragraph
							>
								We wish you happy games!
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
