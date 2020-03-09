export default class GameListElement extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<li>{this.props.game.Name}</li>
		);
	}
}

