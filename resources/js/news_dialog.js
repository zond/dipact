import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class NewsDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			activeItem: 0,
			newsItems: [
				{
					header: "Nexus Season 6 tournament",
					content: (
						<React.Fragment>
							<MaterialUI.Typography variant="h6" style={{}}>
								Nexus Season 6 full press tournament
							</MaterialUI.Typography>
							<MaterialUI.Typography variant="body2">
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
							</MaterialUI.Typography>
						</React.Fragment>
					),
				},
				{
					header: "New Diplicity app",
					content: (
						<React.Fragment>
							<MaterialUI.Typography variant="h6" style={{}}>
								Welcome to the new Diplicity!
							</MaterialUI.Typography>
							<MaterialUI.Typography variant="body2">
								We redesigned our app and started using the new
								version, which is still in Beta. This means
								there may be some (small) bugs that we haven't
								found on our own.
								<br /> If you encounter an issue, please let us
								know and we'll try to fix it ASAP.
								<br />
								<br />
								Thanks!
							</MaterialUI.Typography>

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
									{helpers.createIcon("\ue0b7")}

									<MaterialUI.Typography variant="caption">
										<a
											href="https://groups.google.com/g/diplicity-talk"
											style={{
												color: "#281A1A",
												textDecoration: "none",
											}}
										>
											Give feedback
										</a>
									</MaterialUI.Typography>
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									{helpers.createIcon("\ue868")}
									<MaterialUI.Typography variant="caption">
										<a
											href="mailto:diplicity-talk@googlegroups.com"
											style={{
												color: "#281A1A",
												textDecoration: "none",
											}}
										>
											Report a bug
										</a>{" "}
									</MaterialUI.Typography>
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
									onClick={(_) => {
										this.closeDrawer;
										this.errorsDialog.setState({
											open: true,
										});
									}}
								>
									<MaterialUI.SvgIcon>
										<path
											fill="black"
											d="M12.89,3L14.85,3.4L11.11,21L9.15,20.6L12.89,3M19.59,12L16,8.41V5.58L22.42,12L16,18.41V15.58L19.59,12M1.58,12L8,5.58V8.41L4.41,12L8,15.58V18.41L1.58,12Z"
										/>
									</MaterialUI.SvgIcon>
									<MaterialUI.Typography variant="caption">
										<a style={{ color: "#281A1A" }}>
											Error log
										</a>
									</MaterialUI.Typography>
								</div>
							</div>

							<div
								style={{
									marginTop: "32px",
									textAlign: "center",
								}}
							>
								<MaterialUI.Button
									variant="contained"
									color="primary"
									onClick={(_) => {
										this.setState({
											newsDialogOpen: false,
										});
									}}
								>
									Show me the new app
								</MaterialUI.Button>
							</div>
							<div
								style={{
									textAlign: "center",
									marginTop: "8px",
								}}
							>
								<MaterialUI.Button
									color="primary"
									href="https://sites.google.com/view/diplicity/home/documentation/install-the-old-apk"
								>
									Install the old app
								</MaterialUI.Button>
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
	setForumMail(fm) {
		this.setState((state, props) => {
			state = Object.assign({}, state);
			state.newsItems.splice(1, 0, {
				header: <span>Forum post: {fm.Properties.Subject}</span>,
				content: (
					<React.Fragment>
						<MaterialUI.Typography variant="h6" style={{}}>
							Latest from the forum
						</MaterialUI.Typography>
						<pre style={{ whiteSpace: "pre-wrap" }}>
							{fm.Properties.Subject}
							{"\n\n"}
							{fm.Properties.Body}
						</pre>
						<MaterialUI.Typography variant="body2">
							<a
								href="https://groups.google.com/g/diplicity-talk"
								target="_blank"
							>
								Visit the forum
							</a>
						</MaterialUI.Typography>
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
				<MaterialUI.Dialog
					onEntered={helpers.genOnback(this.close)}
					open={this.state.open}
					fullScreen
					onClose={this.close}
				>
					<MaterialUI.AppBar>
						<MaterialUI.Toolbar>
							<MaterialUI.IconButton
								edge="start"
								color="inherit"
								onClick={(_) => {
									this.setState({ open: false });
								}}
								aria-label="close"
							>
								{helpers.createIcon("\ue5cd")}
							</MaterialUI.IconButton>
							<MaterialUI.Typography
								variant="h6"
								style={{ paddingLeft: "16px" }}
							>
								News
							</MaterialUI.Typography>
						</MaterialUI.Toolbar>
					</MaterialUI.AppBar>
					<div
						style={{
							height: "100%",
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
								height: "calc(100% - 158px)",
							}}
						>
							{this.state.newsItems.map((item, idx) => {
								return (
									<React.Fragment key={idx}>
										{item.content}
										<MaterialUI.Divider
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
				</MaterialUI.Dialog>
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
							backgroundColor: "rgb(255, 244, 229)",
							width: "100%",
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
								{helpers.createIcon("\ue002")}
							</div>
							<MaterialUI.IconButton
								onClick={this.ff}
								size="small"
								style={{ padding: "0px" }}
							>
								{helpers.createIcon("\ue044")}
							</MaterialUI.IconButton>
						</div>
						<div>
							<MaterialUI.Typography
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
							</MaterialUI.Typography>

							<MaterialUI.Typography
								variant="body2"
								style={{ color: "rgb(97, 26, 21)" }}
							>
								For more information, touch here
							</MaterialUI.Typography>
						</div>
					</div>
				</div>
			);
		}
	}
}
