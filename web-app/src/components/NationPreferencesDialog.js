/* eslint-disable no-restricted-globals */
import React from "react";
import * as helpers from "../helpers";
import gtag from "ga-gtag";
import {
	Button,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Paper,
	List,
	ListItem,
	Grid,
	IconButton,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import { ArrowDownwardIcon, ArrowUpwardIcon } from "../icons";

const styles = (theme) => ({
	dialogActions: {
		backgroundColor: "white",
		position: "sticky",
		bottom: "0px",
	},
});

class NationPreferencesDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			nations: this.props.nations,
		};
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.onSelected = this.onSelected.bind(this);
		this.close = this.close.bind(this);
		this.isOpen = helpers.cmpPropsQueryParam(
			"nation-preferences-dialog",
			this.props.gameID
		);
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.isOpen(this.props) && !this.isOpen(prevProps)) {
			gtag("set", {
				page_title: "NationPreferencesDialog",
				page_location: location.href,
			});
			gtag("event", "page_view");
		}
	}
	close() {
		helpers.pushPropsLocationWithoutParam(
			this.props,
			"nation-preferences-dialog"
		);
		return Promise.resolve();
	}
	onSelected(ev) {
		this.close().then(() => {
			this.props.onSelected(this.state.nations);
		});
	}
	render() {
		const { classes } = this.props;
		if (!this.isOpen(this.props)) {
			return "";
		}
		return (
			<Dialog
				open={!!this.isOpen(this.props)}
				TransitionProps={{
					onEnter: helpers.genOnback(this.close),
				}}
				onClose={this.close}
			>
				<DialogTitle>Nation preferences</DialogTitle>
				<DialogContent style={{ paddingBottom: "0px" }}>
					<Typography style={{ margin: "1em" }}>
						Sort the possible nations in order of preference.
					</Typography>
					<Paper elevation={3}>
						<List>
							{this.state.nations.map((nation, idx) => {
								return (
									<ListItem key={nation}>
										<Grid container>
											<Grid key={nation} item xs={10}>
												<Typography>
													{nation}
												</Typography>
											</Grid>
											<Grid
												key={nation + "_down"}
												item
												xs={1}
											>
												<IconButton
													onClick={(_) => {
														if (
															idx + 1 <
															this.state.nations
																.length
														) {
															let nations =
																this.state.nations.slice();
															let tmp =
																nations[
																	idx + 1
																];
															nations[idx + 1] =
																nations[idx];
															nations[idx] = tmp;
															this.setState({
																nations:
																	nations,
															});
														}
													}}
												>
													<ArrowDownwardIcon />
												</IconButton>
											</Grid>
											<Grid
												key={nation + "_up"}
												item
												xs={1}
											>
												<IconButton
													onClick={(_) => {
														if (idx > 0) {
															let nations =
																this.state.nations.slice();
															let tmp =
																nations[
																	idx - 1
																];
															nations[idx - 1] =
																nations[idx];
															nations[idx] = tmp;
															this.setState({
																nations:
																	nations,
															});
														}
													}}
												>
													<ArrowUpwardIcon />
												</IconButton>
											</Grid>
										</Grid>
									</ListItem>
								);
							})}
						</List>
					</Paper>
					<DialogActions className={classes.dialogActions}>
						<Button onClick={this.onSelected} color="primary">
							Join
						</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
		);
	}
}

export default withRouter(
	withStyles(styles, { withTheme: true })(NationPreferencesDialog)
);
