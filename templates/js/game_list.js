export default class GameList extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<ul>
			{this.props.games.map((game, idx) => { return ( <li key={idx}>A game</li> ); })}
			</ul>
		);
	}
}
