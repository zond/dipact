import * as helpers from '%{ cb "/js/helpers.js" }%';

import NationAvatar from '%{ cb "/js/nation_avatar.js"}%';

export default class GameMetadata extends React.Component {
	constructor(props) {
		super(props);
		this.state = { open: false, gameStates: null, bans: Globals.bans };
		this.member = this.props.game.Properties.Members.find(e => {
			return e.User.Email == Globals.user.Email;
		});
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.close = this.close.bind(this);
		this.toggleMuted = this.toggleMuted.bind(this);
		this.valignClass = helpers.scopedClass(
			"display: flex; align-items: center;"
		);
	}
	toggleBanned(uid) {
		return _ => {
			if (Globals.bans[uid]) {
				let unsignLink = Globals.bans[uid].Links.find(l => {
					return l.Rel == "unsign";
				});
				if (unsignLink) {
					helpers.incProgress();
					helpers
						.safeFetch(
							helpers.createRequest(unsignLink.URL, {
								method: unsignLink.Method
							})
						)
						.then(res => res.json())
						.then(js => {
							helpers.decProgress();
							delete Globals.bans[uid];
							this.setState({ bans: Globals.bans });
						});
				}
			} else {
				helpers.incProgress();
				helpers
					.safeFetch(
						helpers.createRequest(
							"/User/" + Globals.user.Id + "/Ban",
							{
								method: "POST",
								headers: {
									"Content-Type": "application/json"
								},
								body: JSON.stringify({
									UserIds: [Globals.user.Id, uid]
								})
							}
						)
					)
					.then(res => res.json())
					.then(js => {
						helpers.decProgress();
						Globals.bans[uid] = js;
						this.setState({ bans: Globals.bans });
					});
			}
		};
	}
	toggleMuted(nation) {
		return _ => {
			let gameState = this.state.gameStates[this.member.Nation];
			if (gameState.Properties.Muted == null) {
				gameState.Properties.Muted = [];
			}
			let idx = gameState.Properties.Muted.indexOf(nation);
			if (idx == -1) {
				gameState.Properties.Muted.push(nation);
			} else {
				gameState.Properties.Muted = gameState.Properties.Muted.slice(
					0,
					idx
				).concat(gameState.Properties.Muted.slice(idx + 1));
			}
			let updateLink = this.state.gameStates[
				this.member.Nation
			].Links.find(l => {
				return l.Rel == "update";
			});
			helpers.incProgress();
			helpers
				.safeFetch(
					helpers.createRequest(updateLink.URL, {
						headers: {
							"Content-Type": "application/json"
						},
						method: updateLink.Method,
						body: JSON.stringify(gameState.Properties)
					})
				)
				.then(res => res.json())
				.then(js => {
					helpers.decProgress();
					this.setState((state, props) => {
						state = Object.assign({}, state);
						state.gameStates[this.member.Nation].Properties =
							js.Properties;
						return state;
					});
				});
		};
	}
	close() {
		this.setState({ open: false });
	}
	componentDidMount() {
		let gameStatesLink = this.props.game.Links.find(l => {
			return l.Rel == "game-states";
		});
		if (gameStatesLink) {
			helpers.incProgress();
			helpers
				.safeFetch(
					helpers.createRequest(
						this.props.game.Links.find(l => {
							return l.Rel == "game-states";
						}).URL
					)
				)
				.then(res => res.json())
				.then(js => {
					helpers.decProgress();
					this.setState((state, props) => {
						state = Object.assign({}, state);
						state.gameStates = {};
						js.Properties.forEach(gameState => {
							state.gameStates[
								gameState.Properties.Nation
							] = gameState;
						});
						return state;
					});
				});
		}
	}
	render() {
		return (
			<MaterialUI.Dialog
				open={this.state.open}
				className="find-game-dialog"
				disableBackdropClick={false}
				classes={{
					paper: helpers.scopedClass("margin: 2px; width: 100%;")
				}}
				onClose={this.close}
			>
				<MaterialUI.DialogTitle>Game metadata</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent>
					<MaterialUI.Grid container>
						{this.state.gameStates
							? this.props.game.Properties.Members.map(member => {
									return (
										<React.Fragment
											key={member.Nation + "-fragment"}
										>
											<MaterialUI.Grid
												key={
													member.Nation +
													"-user-avatar"
												}
												item
												xs={2}
											>
												<MaterialUI.Avatar
													className={
														helpers.avatarClass
													}
													alt={member.User.Name}
													src={member.User.Picture}
												/>
											</MaterialUI.Grid>
											<MaterialUI.Grid
												key={
													member.Nation + "-user-name"
												}
												item
												xs={6}
												className={this.valignClass}
											>
												<MaterialUI.Typography>
													{member.User.Name}
												</MaterialUI.Typography>
											</MaterialUI.Grid>
											<MaterialUI.Grid
												key={
													member.Nation +
													"-nation-banned"
												}
												item
												xs={4}
											>
												<MaterialUI.FormControlLabel
													control={
														<MaterialUI.Checkbox
															disabled={
																member.User
																	.Id ==
																Globals.user.Id
															}
															checked={
																!!this.state
																	.bans[
																	member.User
																		.Id
																]
															}
															onChange={this.toggleBanned(
																member.User.Id
															)}
														/>
													}
													label="Banned"
												/>
											</MaterialUI.Grid>
											<MaterialUI.Grid
												key={
													member.Nation +
													"-nation-avatar"
												}
												item
												xs={2}
											>
												<NationAvatar
													nation={member.Nation}
													variant={this.props.variant}
												/>
											</MaterialUI.Grid>
											<MaterialUI.Grid
												key={
													member.Nation +
													"-nation-name"
												}
												className={this.valignClass}
												item
												xs={6}
											>
												<MaterialUI.Typography>
													{member.Nation}
												</MaterialUI.Typography>
											</MaterialUI.Grid>
											<MaterialUI.Grid
												item
												key={
													member.Nation +
													"-user-muted"
												}
												xs={4}
											>
												<MaterialUI.FormControlLabel
													control={
														<MaterialUI.Checkbox
															disabled={
																!this.member ||
																member.Nation ==
																	this.member
																		.Nation
															}
															checked={
																this.member &&
																(
																	this.state
																		.gameStates[
																		this
																			.member
																			.Nation
																	].Properties
																		.Muted ||
																	[]
																).indexOf(
																	member.Nation
																) != -1
															}
															onChange={this.toggleMuted(
																member.Nation
															)}
														/>
													}
													label="Muted"
												/>
											</MaterialUI.Grid>
											<MaterialUI.Grid
												item
												key={member.Nation + "-divider"}
												xs={12}
											>
												<MaterialUI.Divider />
											</MaterialUI.Grid>
										</React.Fragment>
									);
							  })
							: ""}
					</MaterialUI.Grid>
					<MaterialUI.DialogActions>
						<MaterialUI.Button onClick={this.close} color="primary">
							Close
						</MaterialUI.Button>
					</MaterialUI.DialogActions>
				</MaterialUI.DialogContent>
			</MaterialUI.Dialog>
		);
	}
}
