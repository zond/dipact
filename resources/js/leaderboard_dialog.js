import * as helpers from '%{ cb "/js/helpers.js" }%';

import UserAvatar from '%{ cb "/js/user_avatar.js" }%';

export default class LeaderboardDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userStats: []
		};
		this.makeRow = this.makeRow.bind(this);
		this.onClose = helpers.genUnbackClose(this.props.onClose);
	}
	makeRow(pos, user) {
		return (
			<MaterialUI.TableRow key={user.Id}>
				<MaterialUI.TableCell>{pos}</MaterialUI.TableCell>
				<MaterialUI.TableCell>
					<UserAvatar user={user} />
				</MaterialUI.TableCell>
				<MaterialUI.TableCell>{user.Name}</MaterialUI.TableCell>
			</MaterialUI.TableRow>
		);
	}
	componentDidMount() {
		helpers.incProgress();
		helpers
			.safeFetch(helpers.createRequest("/Users/TopRated"))
			.then(resp => resp.json())
			.then(js => {
				helpers.decProgress();
				this.setState({ userStats: js.Properties });
				gtag("set", { "page_title": "LeaderboardDialog", "page_path": location.href });
				gtag("event", "page_view");
			});
	}
	render() {
		return (
			<MaterialUI.Dialog
				onEntered={helpers.genOnback(this.props.onClose)}
				disableBackdropClick={false}
				open={true}
				onClose={this.onClose}
			>
				<MaterialUI.DialogTitle>Leaderboard</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent>
					<MaterialUI.TableContainer component={MaterialUI.Paper}>
						<MaterialUI.Table>
							<MaterialUI.TableBody>
								{this.state.userStats.map((userStat, idx) => {
									return this.makeRow(
										idx + 1,
										userStat.Properties.User
									);
								})}
							</MaterialUI.TableBody>
						</MaterialUI.Table>
					</MaterialUI.TableContainer>
				</MaterialUI.DialogContent>
				<MaterialUI.DialogActions>
					<MaterialUI.Button onClick={this.onClose} color="primary">
						Close
					</MaterialUI.Button>
				</MaterialUI.DialogActions>
			</MaterialUI.Dialog>
		);
	}
}
