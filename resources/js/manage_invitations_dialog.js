import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class ManageInvitationsDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			game: this.props.game,
		};
		this.variant = Globals.variants.find((variant) => {
			return variant.Name == this.props.game.Properties.Variant;
		});
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.close = this.close.bind(this);
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
			>
				<MaterialUI.DialogTitle>
					Manage invitations
				</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent>
					{this.state.game.Properties.GameMasterInvitations &&
					this.state.game.Properties.GameMasterInvitations.length >
						0 ? (
						<MaterialUI.Typography style={{ margin: "1em" }}>
							Invited players
						</MaterialUI.Typography>
					) : (
						<MaterialUI.Typography style={{ margin: "1em" }}>
							Nobody invited yet
						</MaterialUI.Typography>
					)}
					<MaterialUI.TextField
						key="Desc"
						label="Email"
						margin="dense"
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
						value="normal_allocation"
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
			</MaterialUI.Dialog>
		);
	}
}
