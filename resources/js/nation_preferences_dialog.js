import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class NationPreferencesDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			onSelected: null,
			nations: []
		};
		this.props.parent.nationPreferencesDialog = this;
		this.onSelected = this.onSelected.bind(this);
	}
	onSelected(ev) {
		this.setState({ open: false });
		this.state.onSelected(this.state.nations);
	}
	render() {
		return (
			<MaterialUI.Dialog open={this.state.open}>
				<MaterialUI.Typography style={{ margin: "1em" }}>
					Sort the possible nations in order of preference.
				</MaterialUI.Typography>
				<MaterialUI.Paper elevation={3}>
					<MaterialUI.List>
						{this.state.nations.map((nation, idx) => {
							return (
								<MaterialUI.ListItem key={nation}>
									<MaterialUI.Grid container>
										<MaterialUI.Grid
											key={nation}
											item
											xs={10}
										>
											<MaterialUI.Typography>
												{nation}
											</MaterialUI.Typography>
										</MaterialUI.Grid>
										<MaterialUI.Grid
											key={nation + "_down"}
											item
											xs={1}
										>
											<MaterialUI.IconButton
												onClick={_ => {
													if (
														idx + 1 <
														this.state.nations
															.length
													) {
														let nations = this.state.nations.slice();
														let tmp =
															nations[idx + 1];
														nations[idx + 1] =
															nations[idx];
														nations[idx] = tmp;
														this.setState({
															nations: nations
														});
													}
												}}
											>
												{helpers.createIcon("\ue5db")}
											</MaterialUI.IconButton>
										</MaterialUI.Grid>
										<MaterialUI.Grid
											key={nation + "_up"}
											item
											xs={1}
										>
											<MaterialUI.IconButton
												onClick={_ => {
													if (idx > 0) {
														let nations = this.state.nations.slice();
														let tmp =
															nations[idx - 1];
														nations[idx - 1] =
															nations[idx];
														nations[idx] = tmp;
														this.setState({
															nations: nations
														});
													}
												}}
											>
												{helpers.createIcon("\ue5d8")}
											</MaterialUI.IconButton>
										</MaterialUI.Grid>
									</MaterialUI.Grid>
								</MaterialUI.ListItem>
							);
						})}
					</MaterialUI.List>
					<MaterialUI.Button onClick={this.onSelected}>
						Join
					</MaterialUI.Button>
				</MaterialUI.Paper>
			</MaterialUI.Dialog>
		);
	}
}
