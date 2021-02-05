import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class ManageInvitationsDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			game: this.props.game,
			email: "",
			nation: "normal_allocation",
		};
		this.variant = Globals.variants.find((variant) => {
			return variant.Name == this.props.game.Properties.Variant;
		});
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.onInvite = this.onInvite.bind(this);
		this.onUninvite = this.onUninvite.bind(this);
		this.close = this.close.bind(this);
	}
	onUninvite(email) {
		return (_) => {
			if (!email) return;
			const link = this.state.game.Links.find((l) => {
				return l.Rel == "uninvite-" + email;
			});
			if (!link) return;
			helpers.incProgress();
			helpers
				.safeFetch(
					helpers.createRequest(link.URL, {
						method: link.Method,
					})
				)
				.then((_) => {
					helpers.decProgress();
					gtag("event", "manage_invitations_dialog_uninvite_user");
					this.props.reloadGame().then((game) => {
						this.setState({ game: game });
					});
				});
		};
	}
	onInvite() {
		if (!this.state.email) return;
		const link = this.state.game.Links.find((l) => {
			return l.Rel == "invite-user";
		});
		if (!link) return;
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest(link.URL, {
					method: link.Method,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						Email: this.state.email,
						Nation:
							this.state.nation == "normal_allocation"
								? ""
								: this.state.nation,
					}),
				})
			)
			.then((_) => {
				helpers.decProgress();
				gtag("event", "manage_invitations_dialog_invite_user");
				this.props.reloadGame().then((game) => {
					this.setState({ game: game });
				});
			});
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!prevState.open && this.state.open) {
			gtag("set", {
				page_title: "ManageInvitationsDialog",
				page_location: location.href,
			});
			gtag("event", "page_view");
		}
	}
	close() {
		helpers.unback(this.close);
		this.setState({ open: false });
	}
	render() {
		if (!this.state.open) {
			return "";
		}
		return (
			<MaterialUI.Dialog
				open={this.state.open}
				onEntered={helpers.genOnback(this.close)}
				disableBackdropClick={false}
				onClose={this.close}
				fullWidth={true}
				maxWidth="xl"
			>
				<MaterialUI.DialogTitle>
					Manage whitelist
				</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent>
					<React.Fragment>
						<MaterialUI.Typography style={{ margin: "1em" }}>
							<span style={{ fontWeight: "bold" }}>
								Email addresses must exactly match their login
								email.
							</span>{" "}
							Login email can be seen in the top right menu with
							the logout option. Whitelisted players are able to
							join the game, even if it requires game master
							whitelisting. If the game master picks a country for
							the whitelisting, that country will be assigned when
							the game starts. No email or messages are sent to
							the player, use the 'Share game' link after opening
							the game to send links to this game.
						</MaterialUI.Typography>
						<MaterialUI.List>
							{(
								this.state.game.Properties
									.GameMasterInvitations || []
							).map((invitation) => {
								return (
									<MaterialUI.ListItem key={invitation.Email}>
										<MaterialUI.Grid container>
											<MaterialUI.Grid
												key="data"
												item
												xs={10}
											>
												<MaterialUI.Typography>
													{invitation.Email}
													{invitation.Nation
														? " as " +
														  invitation.Nation
														: ""}
												</MaterialUI.Typography>
											</MaterialUI.Grid>
											<MaterialUI.Grid
												key="button"
												item
												xs={2}
											>
												<MaterialUI.IconButton
													style={{ padding: "0" }}
													onClick={this.onUninvite(
														invitation.Email
													)}
												>
													{helpers.createIcon(
														"\ue872"
													)}
												</MaterialUI.IconButton>
											</MaterialUI.Grid>
										</MaterialUI.Grid>
									</MaterialUI.ListItem>
								);
							})}
						</MaterialUI.List>
					</React.Fragment>
					<MaterialUI.TextField
						key="Email"
						id="manage-invitations-dialog-email"
						label="Email"
						margin="dense"
						onChange={(ev) => {
							this.setState({ email: ev.target.value });
						}}
						style={{
							marginBottom: "8px",
							flexGrow: "1",
						}}
					/>
					<MaterialUI.InputLabel
						shrink
						id="nationlabel"
						style={{
							marginTop: "16px",
						}}
					>
						Nation
					</MaterialUI.InputLabel>
					<MaterialUI.Select
						key="Nation"
						labelId="nationlabel"
						value={this.state.nation}
						onChange={(ev) => {
							this.setState({ nation: ev.target.value });
						}}
						style={{ marginBottom: "16px" }}
					>
						<MaterialUI.MenuItem
							key="normal_allocation"
							value="normal_allocation"
						>
							Normal allocation
						</MaterialUI.MenuItem>
						{this.variant.Properties.Nations.map((nation) => {
							return (
								<MaterialUI.MenuItem
									key={nation}
									value={nation}
								>
									{nation}
								</MaterialUI.MenuItem>
							);
						})}
					</MaterialUI.Select>
				</MaterialUI.DialogContent>
				<MaterialUI.DialogActions
					className={helpers.scopedClass(
						"background-color: white; position: sticky; bottom: 0px;"
					)}
				>
					<MaterialUI.Button onClick={this.onInvite} color="primary">
						Invite
					</MaterialUI.Button>
				</MaterialUI.DialogActions>
			</MaterialUI.Dialog>
		);
	}
}
