import * as helpers from '%{ cb "/js/helpers.js" }%';

import GameMetadata from '%{ cb "/js/game_metadata.js" }%';

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
			<MaterialUI.Dialog
				open={this.state.open}
				onEntered={helpers.genOnback(this.close)}
				disableBackdropClick={false}
				onClose={this.close}
			>
				<MaterialUI.DialogTitle>Game metadata</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent style={{ paddingBottom: "0px" }}>
					<GameMetadata game={this.props.game} />
				</MaterialUI.DialogContent>
			</MaterialUI.Dialog>
		);
	}
}
