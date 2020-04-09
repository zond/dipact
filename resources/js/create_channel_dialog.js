import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class CreateChannelDialog extends React.Component {
	constructor(props) {
		super(props);
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.close = this.close.bind(this);
		this.toggleMember = this.toggleMember.bind(this);
		this.createChannel = this.createChannel.bind(this);
		this.member = this.props.game.Properties.Members.find(e => {
			return e.User.Email == Globals.user.Email;
		});
		this.state = { open: false, members: {}, errorMessage: null };
		this.state.members[this.member.Nation] = true;
		this.variant = Globals.variants.find(v => {
			return v.Properties.Name == this.props.game.Properties.Variant;
		});
	}
	createChannel() {
		let channel = { Properties: { Members: [] }, Links: [] };
		for (let member in this.state.members) {
			channel.Properties.Members.push(member);
		}
		let nMembers = Object.keys(this.state.members).length;
		if (
			this.props.game.Properties.DisableConferenceChat &&
			nMembers == this.variant.Properties.Nations.length
		) {
			this.setState({
				errorMessage:
					"Conference chat is disabled for this game, you can't create a channel with everyone as a member."
			});
		} else if (
			this.props.game.Properties.DisableGroupChat &&
			nMembers > 2 &&
			nMembers != this.variant.Properties.Nations.length
		) {
			this.setState({
				errorMessage:
					"Group chat is disabled for this game, you can't create a channel with more than two, but less than everyone, as members."
			});
		} else if (
			this.props.game.Properties.DisablePrivateChat &&
			nMembers == 2
		) {
			this.setState({
				errorMessage:
					"Private chat is disabled for this game, you can't create a channel with two members."
			});
		} else {
			this.close().then(_ => {
				this.props.createChannel(channel);
			});
		}
	}
	toggleMember(nation) {
		return _ => {
			this.setState((state, props) => {
				state = Object.assign({}, state);
				if (state.members[nation]) {
					if (
						this.props.game.Properties.DisablePrivateChat &&
						this.props.game.Properties.DisableGroupChat
					) {
						state.members = {};
						state.members[this.member.Nation] = true;
					} else {
						delete state.members[nation];
					}
				} else {
					if (
						this.props.game.Properties.DisablePrivateChat &&
						this.props.game.Properties.DisableGroupChat
					) {
						state.members = {};
						this.variant.Properties.Nations.forEach(nation => {
							state.members[nation] = true;
						});
					} else {
						state.members[nation] = true;
					}
				}
				return state;
			});
		};
	}
	close() {
		return new Promise((res, rej) => {
			this.setState({ open: false }, res);
		});
	}
	render() {
		return (
			<MaterialUI.Dialog
				open={this.state.open}
				disableBackdropClick={false}
				onClose={this.close}
			>
				<MaterialUI.DialogTitle>Create channel</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent>
					<MaterialUI.DialogContentText>
						Pick the participants of the new channel.
					</MaterialUI.DialogContentText>
					<MaterialUI.FormGroup>
						{this.variant.Properties.Nations.map(n => {
							return (
								<MaterialUI.FormControlLabel
									key={n}
									control={
										<MaterialUI.Checkbox
											disabled={n == this.member.Nation}
											checked={!!this.state.members[n]}
											onChange={this.toggleMember(n)}
										/>
									}
									label={n}
								/>
							);
						})}
					</MaterialUI.FormGroup>
					<MaterialUI.DialogActions>
						<MaterialUI.Button onClick={this.close} color="primary">
							Cancel
						</MaterialUI.Button>
						<MaterialUI.Button
							onClick={this.createChannel}
							color="primary"
						>
							Create
						</MaterialUI.Button>
					</MaterialUI.DialogActions>
				</MaterialUI.DialogContent>
				<MaterialUI.Snackbar
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center"
					}}
					open={!!this.state.errorMessage}
					autoHideDuration={6000}
					onClose={_ => {
						this.setState({ errorMessage: null });
					}}
					message={this.state.errorMessage}
					action={
						<MaterialUI.IconButton
							size="small"
							aria-label="close"
							color="inherit"
							onClick={_ => {
								this.setState({ errorMessage: null });
							}}
						>
							{helpers.createIcon("\ue5cd")}
						</MaterialUI.IconButton>
					}
				/>
			</MaterialUI.Dialog>
		);
	}
}
