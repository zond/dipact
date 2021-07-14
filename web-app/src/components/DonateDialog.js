import React from 'react';
import {
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Typography
} from '@material-ui/core';

import { GoBackIcon } from '../icons'
import * as helpers from '../helpers';

export default class DonateDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
		};
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.close = this.close.bind(this);
	}
	close() {
		helpers.unback(this.close);
		this.setState({ open: false });
	}
	render() {
		if (!this.state.open) {
			return "";
		}
		return (
			<Dialog
				onEntered={helpers.genOnback(this.close)}
				open={this.state.open}
				fullScreen
				disableBackdropClick={false}
				classes={{
					paper: helpers.scopedClass("margin: 2px; width: 100%;"),
				}}
				onClose={this.close}
			>
				<AppBar>
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							onClick={this.close}
							aria-label="close"
						>
							<GoBackIcon />
						</IconButton>
						<Typography
							variant="h6"
							style={{ paddingLeft: "16px" }}
						>
							Donate
						</Typography>
					</Toolbar>
				</AppBar>
				<div style={{ marginTop: 64, padding: 8 }}>
					<p>
						This is a free game. It's free to play and the{" "}
						<a href="https://github.com/zond/dipact">sourcecode</a>{" "}
						is available for anyone that wants it.
					</p>
					<p>
						Running the server for the game is not free, however.
						The dev team behind diplicity spends about USD 50 per
						month to pay for CPU, storage, and bandwidth.
					</p>
					<p>
						If you enjoy the game and feel like contributing, it
						would be greatly appreciated.
					</p>
					<p>
						To contribute, send donations in the Cardano crypto
						currency ADA to our{" "}
						<button
							type="button"
							onClick={(ev) => {
								ev.preventDefault();
								ev.stopPropagation();
								helpers.copyToClipboard(
									"addr1qxey62mry7ee2k8n56llc9ra3pr05x5khdzqdh8ea9uu60mlf6rhkegzsxet2val95au2nvyxxy3l6nrcema6hccy3vqycr3kz"
								);
								helpers.snackbar(
									"Wallet address copied to clipboard."
								);
							}}
						>
							Cardano wallet
						</button>
					</p>
					<p>
						If you want to contribute but don't know how to get your
						hands on ADA coins, see{" "}
						<a href="https://www.google.com/search?q=buy+cardano+ada">
							buy cardano ada
						</a>{" "}
						or contact the{" "}
						<a href="https://groups.google.com/g/diplicity-talk">
							forum
						</a>
						.
					</p>
				</div>
			</Dialog>
		);
	}
}

