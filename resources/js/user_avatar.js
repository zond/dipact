import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class UserAvatar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { dialogOpen: false, userStats: null };
		this.close = this.close.bind(this);
	}
	close() {
		this.setState({ dialogOpen: false, picker: null });
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.state.dialogOpen && !this.state.userStats) {
			helpers.incProgress();
			helpers
				.safeFetch(
					helpers.createRequest(
						"/User/" + this.props.user.Id + "/Stats"
					)
				)
				.then(resp => resp.json())
				.then(js => {
					helpers.decProgress();
					this.setState({ userStats: js });
				});
		}
	}
	render() {
		return (
			<React.Fragment>
				<MaterialUI.IconButton
					className={helpers.scopedClass("padding: 0px;")}
					onClick={_ => {
						this.setState({ dialogOpen: true });
					}}
				>
					<MaterialUI.Avatar
						className={helpers.avatarClass}
						alt={this.props.user.Name}
						src={this.props.user.Picture}
						style={{ marginRight: "16px" }}
					/>
				</MaterialUI.IconButton>
				<MaterialUI.Dialog
					onEntered={helpers.genOnback(this.close)}
					onExited={helpers.genUnback(this.close)}
					open={this.state.dialogOpen}
					disableBackdropClick={false}
					onClose={this.close}
				>
					<MaterialUI.DialogTitle>
						{this.props.user.Name}
					</MaterialUI.DialogTitle>
					<MaterialUI.DialogContent>
						{this.state.userStats ? (
							<MaterialUI.TableContainer
								component={MaterialUI.Paper}
							>
								<MaterialUI.Table>
									<MaterialUI.TableBody>
										<MaterialUI.TableRow>
											<MaterialUI.TableCell>
												Ranking
											</MaterialUI.TableCell>
											<MaterialUI.TableCell>
												#
												{
													this.state.userStats
														.Properties.TrueSkill
														.HigherRatedCount
												}{" "}
												(TrueSkill{" "}
												{helpers.twoDecimals(
													this.state.userStats
														.Properties.TrueSkill
														.Rating
												)}
												)
											</MaterialUI.TableCell>
										</MaterialUI.TableRow>
									</MaterialUI.TableBody>
								</MaterialUI.Table>
							</MaterialUI.TableContainer>
						) : (
							""
						)}
					</MaterialUI.DialogContent>
					<MaterialUI.DialogActions>
						<MaterialUI.Button onClick={this.close} color="primary">
							Close
						</MaterialUI.Button>
					</MaterialUI.DialogActions>
				</MaterialUI.Dialog>
			</React.Fragment>
		);
	}
}
