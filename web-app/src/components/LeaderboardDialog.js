/* eslint-disable no-restricted-globals */
import React from "react";
import * as helpers from "../helpers";
import gtag from "ga-gtag";
import {
	Button,
	TableRow,
	TableCell,
	Dialog,
	DialogTitle,
	DialogContent,
	TableContainer,
	Table,
	Paper,
	TableBody,
	DialogActions,
} from "@material-ui/core";

import UserAvatar from "./UserAvatar";

export default class LeaderboardDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userStats: [],
		};
		this.makeRow = this.makeRow.bind(this);
		this.onClose = helpers.genUnbackClose(this.props.onClose);
	}
	makeRow(pos, user) {
		return (
			<TableRow key={user.Id}>
				<TableCell>{pos}</TableCell>
				<TableCell>
					<UserAvatar user={user} />
				</TableCell>
				<TableCell>{user.Name}</TableCell>
			</TableRow>
		);
	}
	componentDidMount() {
		helpers.incProgress();
		helpers
			.safeFetch(helpers.createRequest("/Users/TopRated"))
			.then((resp) => resp.json())
			.then((js) => {
				helpers.decProgress();
				this.setState({ userStats: js.Properties });
				gtag("set", {
					page_title: "LeaderboardDialog",
					page_location: location.href,
				});
				gtag("event", "page_view");
			});
	}
	render() {
		return (
			<Dialog
				TransitionProps={{
					onEnter: helpers.genOnback(this.close),
				}}
				open={true}
				onClose={this.onClose}
			>
				<DialogTitle>Leaderboard</DialogTitle>
				<DialogContent>
					<TableContainer component={Paper}>
						<Table>
							<TableBody>
								{this.state.userStats.map((userStat, idx) => {
									return this.makeRow(
										idx + 1,
										userStat.Properties.User
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.onClose} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}
