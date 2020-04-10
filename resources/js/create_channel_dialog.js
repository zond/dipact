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
		this.state = { open: false, members: {} };
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
		this.close().then(_ => {
			this.props.createChannel(channel);
		});
	}
	toggleMember(nation) {
		return _ => {
			this.setState((state, props) => {
				state = Object.assign({}, state);
				if (state.members[nation]) {
					delete state.members[nation];
				} else {
					state.members[nation] = true;
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
					</MaterialUI.DialogContent>
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
				
			</MaterialUI.Dialog>
		);

	}
}
