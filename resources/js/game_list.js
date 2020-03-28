import * as helpers from '%{ cb "/js/helpers.js" }%';

import GameListElement from '%{ cb "/js/game_list_element.js" }%';

export default class GameList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		if (this.props.predefinedList) {
			this.setState({ games: this.props.predefinedList });
		} else {
			helpers.incProgress();
			helpers
				.safeFetch(helpers.createRequest(this.props.url.toString()))
				.then(resp => resp.json())
				.then(js => {
					helpers.decProgress();
					this.setState({ games: js.Properties });
				});
		}
	}
	render() {
		if (this.state.games) {
			return this.state.games.map(game => {
				return <GameListElement key={game.Properties.ID} game={game} />;
			});
		} else {
			return "";
		}
	}
}
