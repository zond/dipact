/* eslint-disable no-restricted-globals */
import React from "react";
import gtag from "ga-gtag";
import {
	Button,
	Checkbox,
	DialogActions,
	FormGroup,
	FormControlLabel,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import Globals from "../Globals";

import * as helpers from "../helpers";

class CreateChannelDialog extends React.Component {
	constructor(props) {
		super(props);
		this.close = this.close.bind(this);
		this.toggleMember = this.toggleMember.bind(this);
		this.createChannel = this.createChannel.bind(this);
		this.member = (this.props.game.Properties.Members || []).find((e) => {
			return e.User.Email === Globals.user.Email;
		});
		this.state = { members: {} };
		this.state.members[this.member.Nation] = true;
		this.variant = Globals.variants.find((v) => {
			return v.Properties.Name === this.props.game.Properties.Variant;
		});
		this.isOpen = helpers.cmpPropsQueryParam("create-channel-dialog", 1);
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.isOpen(this.props) && !this.isOpen(prevProps)) {
			gtag("set", {
				page_title: "CreateChannelDialog",
				page_location: location.href,
			});
			gtag("event", "page_view");
		}
	}
	createChannel() {
		let channel = { Properties: { Members: [] }, Links: [] };
		for (let member in this.state.members) {
			channel.Properties.Members.push(member);
		}
		channel.Links.push({
			Rel: "messages",
			Method: "GET",
			URL:
				"/Game/" +
				this.props.game.Properties.ID +
				"/Channel/" +
				channel.Properties.Members.join(",") +
				"/Messages",
		});
		let nMembers = Object.keys(this.state.members).length;
		if (nMembers < 2) {
			helpers.snackbar("A chat channel requires at least two members.");
		} else if (
			!this.props.game.Properties.Finished &&
			this.props.game.Properties.DisableConferenceChat &&
			nMembers === this.variant.Properties.Nations.length
		) {
			helpers.snackbar(
				"Conference chat is disabled for this game, you can't create a channel with everyone as a member."
			);
		} else if (
			!this.props.game.Properties.Finished &&
			this.props.game.Properties.DisableGroupChat &&
			nMembers > 2 &&
			nMembers !== this.variant.Properties.Nations.length
		) {
			helpers.snackbar(
				"Group chat is disabled for this game, you can't create a channel with more than two, but less than everyone, as members."
			);
		} else if (
			!this.props.game.Properties.Finished &&
			this.props.game.Properties.DisablePrivateChat &&
			nMembers === 2
		) {
			helpers.snackbar(
				"Private chat is disabled for this game, you can't create a channel with two members."
			);
		} else {
			this.close().then((_) => {
				this.props.createChannel(channel);
			});
		}
	}
	toggleMember(nation) {
		return (_) => {
			this.setState((state, props) => {
				state = Object.assign({}, state);
				if (state.members[nation]) {
					if (
						this.props.game.Properties.DisablePrivateChat &&
						this.props.game.Properties.DisableGroupChat
					) {
						state.members = {};
						state.members[this.member.Nation] = true;
					} else {
						delete state.members[nation];
					}
				} else {
					if (
						this.props.game.Properties.DisablePrivateChat &&
						this.props.game.Properties.DisableGroupChat
					) {
						state.members = {};
						this.variant.Properties.Nations.forEach((nation) => {
							state.members[nation] = true;
						});
					} else {
						state.members[nation] = true;
					}
				}
				return state;
			});
		};
	}
	close() {
		helpers.pushPropsLocationWithoutParam(
			this.props,
			"create-channel-dialog"
		);
		return Promise.resolve();
	}
	render() {
		if (!this.isOpen(this.props)) {
			return "";
		}
		return (
			<Dialog open={!!this.isOpen(this.props)} onClose={this.close}>
				<DialogTitle>Create channel</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Pick the participants of the new channel.
					</DialogContentText>
					<FormGroup>
						{this.variant.Properties.Nations.map((n) => {
							return (
								<FormControlLabel
									key={n}
									control={
										<Checkbox
											disabled={n === this.member.Nation}
											checked={!!this.state.members[n]}
											onChange={this.toggleMember(n)}
										/>
									}
									label={n}
								/>
							);
						})}
					</FormGroup>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.close} color="primary">
						Cancel
					</Button>
					<Button onClick={this.createChannel} color="primary">
						Create
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default withRouter(CreateChannelDialog);
