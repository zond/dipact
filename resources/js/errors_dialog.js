import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class ErrorsDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = { open: false, errors: [] };
		this.close = this.close.bind(this);
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.errors = null;
	}
	close() {
		helpers.unback(this.close);
		this.setState({ open: false });
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!prevState.open && this.state.open) {
			gtag("set", {
				page_title: "ErrorsDialog",
				page_location: location.href
			});
			gtag("event", "page_view");
			const jsonErrors = localStorage.getItem("errors");
			const errors = (jsonErrors ? JSON.parse(jsonErrors) : []).map(
				el => {
					el.at = new Date(el.at);
					return el;
				}
			);
			this.setState({ errors: errors });
		}
	}
	render() {
		return (
			<MaterialUI.Dialog
				onEntered={helpers.genOnback(this.close)}
				classes={{
					paper: helpers.scopedClass("margin: 2px; width: 100%;")
				}}
				open={this.state.open}
				disableBackdropClick={false}
				onClose={this.close}
			>
				<MaterialUI.DialogTitle>
					JavaScript errors
				</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent>
					{this.state.errors.length > 0 ? (
						<MaterialUI.List>
							{this.state.errors.map((el, idx) => {
								return (
									<MaterialUI.ListItem key={idx}>
										<MaterialUI.Button
											style={{ textTransform: "none" }}
											variant="outlined"
											onClick={_ => {
												helpers
													.copyToClipboard(
														JSON.stringify(el)
													)
													.then(_ => {
														helpers.snackbar(
															"Error copied to clipboard"
														);
													});
											}}
										>
											{el.message}
										</MaterialUI.Button>
									</MaterialUI.ListItem>
								);
							})}
						</MaterialUI.List>
					) : (
						<p>No errors found.</p>
					)}
					<MaterialUI.DialogActions
						className={helpers.scopedClass(
							"background-color: white; position: sticky; bottom: 0px;"
						)}
					>
						<MaterialUI.Button onClick={this.close} color="primary">
							Close
						</MaterialUI.Button>
					</MaterialUI.DialogActions>
				</MaterialUI.DialogContent>
			</MaterialUI.Dialog>
		);
	}
}
