import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class RenameGameDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			newName: this.props.game.Properties.Members.find(m => {
				return m.User.Id == Globals.user.Id;
			}).GameAlias
		};
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.close = this.close.bind(this);
		this.rename = this.rename.bind(this);
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!prevState.open && this.state.open) {
			gtag("set", { "page_title": "RenameGameDialog", "page_location": location.href });
			gtag("event", "page_view");
		}
	}
	rename() {
		const renameLink = this.props.game.Links.find(l => {
			return l.Rel == "update-membership";
		});
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest(renameLink.URL, {
					method: renameLink.Method,
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ GameAlias: this.state.newName })
				})
			)
			.then(resp => {
				helpers.decProgress();
				this.close();
				this.props.onRename();
			});
	}
	close() {
		helpers.unback(this.close);
		this.setState({ open: false });
	}
	render() {
		return (
			<MaterialUI.Dialog
				open={this.state.open}
				onEntered={helpers.genOnback(this.close)}
				disableBackdropClick={false}
				onClose={this.close}
			>
				<MaterialUI.DialogTitle>
					Rename {this.props.game.Properties.Desc}
				</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent>
					<MaterialUI.TextField
						key="alias"
						label="New name"
						margin="dense"
						fullWidth
						value={this.state.newName}
						onChange={ev => {
							this.setState({ newName: ev.target.value });
						}}
					/>
					<MaterialUI.DialogActions>
						<MaterialUI.Button onClick={this.close} color="primary">
							Cancel
						</MaterialUI.Button>
						<MaterialUI.Button
							onClick={this.rename}
							color="primary"
						>
							Rename
						</MaterialUI.Button>
					</MaterialUI.DialogActions>
				</MaterialUI.DialogContent>
			</MaterialUI.Dialog>
		);
	}
}
