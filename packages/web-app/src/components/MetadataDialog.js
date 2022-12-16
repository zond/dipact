import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core'

import * as helpers from '../helpers';
import GameMetadata from './GameMetadata';

export default class MetadataDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
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
		return (
			<Dialog
				open={this.state.open}
				onEntered={helpers.genOnback(this.close)}
				disableBackdropClick={false}
				onClose={this.close}
			>
				<DialogTitle>Game info</DialogTitle>
				<DialogContent style={{ paddingBottom: "0px" }}>
					<GameMetadata game={this.props.game} />
				</DialogContent>
			</Dialog>
		);
	}
}

