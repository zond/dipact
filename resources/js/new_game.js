import * as helpers from '%{ cb "/js/helpers.js" }%';

import CreateGameDialog from '%{ cb "/js/create_game_dialog.js" }%';

export default class NewGame extends React.Component {
	constructor(props) {
		super(props);
		this.createGameDialog = null;
	}
	render() {
		return (
			<React.Fragment>
				<MaterialUI.ButtonGroup orientation="vertical">
					<MaterialUI.Button
						key="find-open"
						onClick={this.props.findOpenGame}
					>
						Find open game
					</MaterialUI.Button>
					<MaterialUI.Button
						key="find-private"
						onClick={this.props.findPrivateGame}
					>
						Find private game
					</MaterialUI.Button>
					<MaterialUI.Button
						key="create"
						onClick={_ => {
							this.createGameDialog.setState({ open: true });
						}}
					>
						Create game
					</MaterialUI.Button>
				</MaterialUI.ButtonGroup>
				<CreateGameDialog parent={this} />
			</React.Fragment>
		);
	}
}
