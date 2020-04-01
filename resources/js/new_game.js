import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class NewGame extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
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
				<MaterialUI.Button key="create">Create game</MaterialUI.Button>
			</MaterialUI.ButtonGroup>
		);
	}
}
