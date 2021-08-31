/* eslint-disable no-restricted-globals */
import React from "react";
import gtag from "ga-gtag";
import { Dialog, ButtonGroup, Button } from "@material-ui/core";

import * as helpers from "../helpers";

export default class OrderDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			options: [],
			onClick: null,
			onClose: null,
		};
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.onClick = this.onClick.bind(this);
		this.close = this.close.bind(this);
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!prevState.open && this.state.open) {
			gtag("set", {
				page_title: "OrderDialog",
				page_location: location.href,
			});
			gtag("event", "page_view");
		}
	}
	onClick(ev) {
		const option = ev.currentTarget.getAttribute("xoption");
		this.setState({ open: false }, (_) => {
			if (this.state.onClick) {
				this.state.onClick(option);
			}
		});
	}
	close() {
		helpers.unback(this.close);
		this.setState({ open: false }, (_) => {
			if (this.state.onClose) {
				this.state.onClose();
			}
		});
	}
	render() {
		return (
			<Dialog
				TransitionProps={{
					onEnter: helpers.genOnback(this.close),
				}}
				open={this.state.open}
				onClose={this.close}
			>
				<ButtonGroup orientation="vertical">
					{this.state.options.map((option) => {
						return (
							<Button
								key={option}
								xoption={option}
								onClick={this.onClick}
							>
								{option}
							</Button>
						);
					})}
				</ButtonGroup>
			</Dialog>
		);
	}
}
