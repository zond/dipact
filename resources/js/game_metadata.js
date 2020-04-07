import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class GameMetadata extends React.Component {
	constructor(props) {
		super(props);
		this.state = { open: false, gameStates: {} };
		this.member = this.props.game.Properties.Members.find(e => {
			return e.User.Email == Globals.user.Email;
		});
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
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
				classes={{ paper: helpers.scopedClass("margin: 0px;") }}
				onClose={this.close}
			>
				<MaterialUI.DialogTitle>Game metadata</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent>
					<MaterialUI.TableContainer component={MaterialUI.Paper}>
						<MaterialUI.Table size="small">
							<MaterialUI.TableHead>
								<MaterialUI.TableRow>
									<MaterialUI.TableCell>
										Player/Nation
									</MaterialUI.TableCell>
									<MaterialUI.TableCell align="right">
										Muted
									</MaterialUI.TableCell>
									<MaterialUI.TableCell align="right">
										Banned
									</MaterialUI.TableCell>
								</MaterialUI.TableRow>
							</MaterialUI.TableHead>
							<MaterialUI.TableBody>
								{this.state.gameStates[this.member.Nation]
									? this.props.game.Properties.Members.map(
											member => {
												return (
													<MaterialUI.TableRow
														key={member.Nation}
													>
														<MaterialUI.TableCell
															component="th"
															scope="row"
														>
															{member.User.Name}/
															{member.Nation}
														</MaterialUI.TableCell>
														<MaterialUI.TableCell align="right">
															<MaterialUI.Checkbox
																checked={
																	(
																		this
																			.state
																			.gameStates[
																			this
																				.member
																				.Nation
																		]
																			.Properties
																			.Muted ||
																		[]
																	).indexOf(
																		member.Nation
																	) != -1
																}
																disabled={true}
															/>
														</MaterialUI.TableCell>
														<MaterialUI.TableCell align="right">
															<MaterialUI.Checkbox
																checked={false}
																disabled={true}
															/>
														</MaterialUI.TableCell>
													</MaterialUI.TableRow>
												);
											}
									  )
									: ""}
							</MaterialUI.TableBody>
						</MaterialUI.Table>
					</MaterialUI.TableContainer>
				</MaterialUI.DialogContent>
			</MaterialUI.Dialog>
		);
	}
}
