/* eslint-disable no-restricted-globals */
import React from "react";
import * as helpers from "../helpers";
import {
	Dialog,
	Divider,
	Button,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
} from "@material-ui/core";
import Globals from "../Globals";
import {
	BugReportIcon,
	ChatIcon,
	CloseIcon,
	SkipNextIcon,
	WarningIcon,
} from "../icons";
import ColdWarPath from "../static/img/coldwar.png";

export default class NewsDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			activeItem: 0,
			newsItems: [
				{
					header: "CW4 - 2021 Nexus Cold War Tournament",
					background: ColdWarPath,
					content: (
						<React.Fragment>
							<Typography variant="h6" style={{}}>
								2021 Nexus Cold War Tournament: CW4
							</Typography>
							<Typography variant="body2">
								The largest online 1vs1 event is back: Nexus
								announces that their Fourth Cold War Tournament
								(CW4) will start soon!
								<br />
								The previous edition of this event involved 53
								players to face each other for more than two
								months last Spring. Now, it is time to run Cold
								War games again and see who's the best tactitian
								around!
								<br />
								Registration to CW4 will open on August 10th and
								end on August 30th. The Tournament will start on
								September 7th.
								<br />
								To get more info and register, go to{" "}
								<a href="https://discord.gg/GTF4p8QQ4k">
									https://discord.gg/GTF4p8QQ4k
								</a>
								.
							</Typography>
						</React.Fragment>
					),
				},
				{
					header: "Join the Nexus Cold War Tournament",
					background: ColdWarPath,
					content: (
						<React.Fragment>
							<Typography variant="h6" style={{}}>
								Nexus Cold War Tournament
							</Typography>
							<Typography variant="body2">
								Dear players, registrations for the third Nexus
								Cold War Tournament are open until February
								20th.
								<br />
								The tournament is starting on Feb 27th. At the
								moment more than 40 people have already
								registered for the competition, making this
								tournament the largest Cold War tournament ever.
								<br />
								The Cold War map is a 1vs1 variant that allows
								the players to show their tactic skills via the
								simulation of a war between NATO and USSR on the
								global stage. You are in time to register and
								indicate Diplicity as your preferred platform:
								go to Nexus, sign up and fight for the third
								Cold War crown!
								<br />
								To register, go to{" "}
								<a href="https://discord.gg/aMTuNJT5JB">
									https://discord.gg/aMTuNJT5JB
								</a>
								.
							</Typography>
						</React.Fragment>
					),
				},
				{
					header: "Nexus Season 6 tournament",
					content: (
						<React.Fragment>
							<Typography variant="h6" style={{}}>
								Nexus Season 6 full press tournament
							</Typography>
							<Typography variant="body2">
								Dear players, registrations for Nexus Season 6
								full press tournament are active and they will
								be open till January 31st.
								<br />
								The tournament will be held on multiple
								platforms, as many as there are players
								available to play in. Diplicity is one of the
								allowed platforms and I hope that many of us may
								want to test themselves in a competitive
								tournament!
								<br />
								Feel free to join and subscribe: you are going
								to have a great time!
								<br />
								To register, go to{" "}
								<a href="https://discord.gg/aMTuNJT5JB">
									https://discord.gg/aMTuNJT5JB
								</a>
								.
							</Typography>
						</React.Fragment>
					),
				},
				{
					header: "New Diplicity app",
					content: (
						<React.Fragment>
							<Typography variant="h6" style={{}}>
								Welcome to the new Diplicity!
							</Typography>
							<Typography variant="body2">
								We redesigned our app and started using the new
								version, which is still in Beta. This means
								there may be some (small) bugs that we haven't
								found on our own.
								<br /> If you encounter an issue, please let us
								know and we'll try to fix it ASAP.
								<br />
								<br />
								Thanks!
							</Typography>

							<div
								style={{
									marginTop: "32px",
									display: "flex",
									justifyContent: "space-evenly",
								}}
							>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									<ChatIcon />

									<Typography variant="caption">
										<a
											href="https://groups.google.com/g/diplicity-talk"
											style={{
												color: "#281A1A",
												textDecoration: "none",
											}}
										>
											Give feedback
										</a>
									</Typography>
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									<BugReportIcon />
									<Typography variant="caption">
										<a
											href="mailto:diplicity-talk@googlegroups.com"
											style={{
												color: "#281A1A",
												textDecoration: "none",
											}}
										>
											Report a bug
										</a>{" "}
									</Typography>
								</div>
							</div>

							<div
								style={{
									textAlign: "center",
									marginTop: "8px",
								}}
							>
								<Button
									color="primary"
									href="https://sites.google.com/view/diplicity/home/documentation/install-the-old-apk"
								>
									Install the old app
								</Button>
							</div>
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
			state.newsItems.splice(1, 0, {
				header: <span>Forum post: {fm.Properties.Subject}</span>,
				content: (
					<React.Fragment>
						<Typography variant="h6" style={{}}>
							Latest from the forum
						</Typography>
						<pre style={{ whiteSpace: "pre-wrap" }}>
							{fm.Properties.Subject}
							{"\n\n"}
							{fm.Properties.Body}
						</pre>
						<Typography variant="body2">
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
			activeItem:
				(this.state.activeItem + 1) % this.state.newsItems.length,
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
							<Typography
								variant="h6"
								style={{ paddingLeft: "16px" }}
							>
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
										<Divider
											style={{ margin: "8 0 12 0" }}
										/>
									</React.Fragment>
								);
							})}
						</div>
						<div
							style={{
								backgroundImage:
									"url('../static/img/soldiers.svg'",
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
				<div style={{ height: "52px" }}>
					<div
						style={{
							borderRadius: "3px",
							display: "flex",
							alignItems: "flex-start",
							padding: "6px 8px",
							margin: "8px 16px 0px 16px",
							backgroundColor: this.state.newsItems[
								this.state.activeItem
							].background
								? null
								: "rgb(255, 244, 229)",
							backgroundSize: "cover",
							backgroundImage: this.state.newsItems[
								this.state.activeItem
							].background
								? "url(" +
								  this.state.newsItems[this.state.activeItem]
										.background +
								  ")"
								: null,
						}}
						onClick={(_) => {
							this.setState({ open: true });
						}}
					>
						<div style={{ float: "left", marginRight: "8px" }}>
							<div
								style={{
									color: "rgb(255, 152, 0)",
								}}
							>
								<WarningIcon />
							</div>
							<IconButton
								onClick={this.ff}
								size="small"
								style={{ padding: "0px" }}
							>
								<SkipNextIcon />
							</IconButton>
						</div>
						<div style={{ width: "calc(100% - 48px)" }}>
							<Typography
								variant="body1"
								style={{
									color: "rgb(97, 26, 21)",
									fontWeight: "500",
								}}
								textroverflow="ellipsis"
								noWrap
							>
								{
									this.state.newsItems[this.state.activeItem]
										.header
								}
							</Typography>

							<Typography
								variant="body2"
								style={{ color: "rgb(97, 26, 21)" }}
							>
								For more information, touch here
							</Typography>
						</div>
					</div>
				</div>
			);
		}
	}
}
