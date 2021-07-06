/* eslint-disable no-restricted-globals */
import React from 'react';
import gtag from 'ga-gtag';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem } from '@material-ui/core'

import * as helpers from '../helpers';

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
			<Dialog
				onEntered={helpers.genOnback(this.close)}
				classes={{
					paper: helpers.scopedClass("margin: 2px; width: 100%;")
				}}
				open={this.state.open}
				disableBackdropClick={false}
				onClose={this.close}
			>
				<DialogTitle>
					JavaScript errors
				</DialogTitle>
				<DialogContent>
					{this.state.errors.length > 0 ? (
						<List>
							{this.state.errors.map((el, idx) => {
								return (
									<ListItem key={idx}>
										<Button
											style={{ textTransform: "none" }}
											variant="outlined"
											onClick={_ => {
												helpers
													.copyToClipboard(
														JSON.stringify(el)
													)
													.then(
														_ => {
															helpers.snackbar(
																"Error copied to clipboard"
															);
														},
														err => {
															console.log(err);
														}
													);
											}}
										>
											{el.message}
										</Button>
									</ListItem>
								);
							})}
						</List>
					) : (
						<p>No errors found.</p>
					)}
					<DialogActions
						className={helpers.scopedClass(
							"background-color: white; position: sticky; bottom: 0px;"
						)}
					>
						<Button onClick={this.close} color="primary">
							Close
						</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
		);
	}
}
