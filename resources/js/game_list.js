import * as helpers from '%{ cb "/js/helpers.js" }%';

import GameListElement from '%{ cb "/js/game_list_element.js" }%';

export default class GameList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			games: this.props.predefinedList || [{ isProgress: true }]
		};
		this.load = this.load.bind(this);
		this.loading = false;
		this.moreLink = null;
	}
	componentDidMount() {
		if (this.props.url) {
			this.load(helpers.createRequest(this.props.url.toString()));
			window.addEventListener("scroll", e => {
				if (
					this.moreLink &&
					!this.loading &&
					window.scrollY >
						document.body.scrollHeight -
							2 * window.visualViewport.height
				) {
					this.load(helpers.createRequest(this.moreLink.URL));
				}
			});
		}
	}
	load(req) {
		this.loading = true;
		helpers
			.safeFetch(req)
			.then(resp => resp.json())
			.then(js => {
				let games = js.Properties;
				this.moreLink = js.Links.find(l => {
					return l.Rel == "next";
				});
				if (this.moreLink) {
					games.push({ isProgress: true });
				}
				this.setState(
					{
						games: this.state.games.slice(0, -1).concat(games)
					},
					_ => {
						this.loading = false;
					}
				);
			});
	}
	render() {
		return this.state.games.map(game => {
			if (game.isProgress) {
				return (
					<div
						key="progress"
						style={{ width: "100%", textAlign: "center" }}
					>
						<MaterialUI.CircularProgress />
					</div>
				);
			} else {
				return <GameListElement key={game.Properties.ID} game={game} />;
			}
		});
	}
}
