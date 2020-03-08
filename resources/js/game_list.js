export default class GameList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		fetch(this.props.url.toString(), { headers: { 'Accept': 'application/json' } })
			.then(resp => resp.json())
			.then(js => {
				this.setState({games: js.Properties});
			});
	}
	render() {
		return (
			<ul>
			{this.state.games ? this.state.games.map((game, idx) => { return <li key={idx}>{game.Name}</li> }) : ""}
			</ul>
		);

	}
}
