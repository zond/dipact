import * as helpers from '%{ cb "/js/helpers.js" }%';

import GameListElement from '%{ cb "/js/game_list_element.js" }%';

export default class GameList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			games: []
		};
		this.load = this.load.bind(this);
		this.maybeLoadMore = this.maybeLoadMore.bind(this);
		this.reload = this.reload.bind(this);
		this.loading = false;
		this.moreLink = null;
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
	}
	maybeLoadMore() {
		let scroller = document.getElementById("scroller");
		if (
			this.moreLink &&
			!this.loading &&
			scroller.scrollTop >
				scroller.scrollHeight - 2 * scroller.clientHeight
		) {
			this.load(helpers.createRequest(this.moreLink.URL));
		}
	}
	reload() {
		this.setState(
			{
				games: this.props.predefinedList || [{ isProgress: true }]
			},
			_ => {
				this.load(helpers.createRequest(this.props.url.toString()));
			}
		);
	}
	componentDidMount() {
		if (this.props.url) {
			this.reload();
			let scroller = document.getElementById("scroller");
			if (scroller) {
				scroller.addEventListener("scroll", this.maybeLoadMore);
			}
		}
	}
	componentWillUnmount() {
		if (this.props.url) {
			let scroller = document.getElementById("scroller");
			if (scroller) {
				scroller.removeEventListener("scroll", this.maybeLoadMore);
			}
		}
	}
	load(req) {
		this.loading = true;
		helpers
			.safeFetch(req, this.props.limit || 64)
			.then(resp => resp.json())
			.then(js => {
				let games = js.Properties;
				if (!this.props.skipMore) {
					this.moreLink = js.Links.find(l => {
						return l.Rel == "next";
					});
				}
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
	renderElement(el) {
		if (el.isProgress) {
			return (
				<div
					key="progress"
					style={{
						"width": "100%",
						"textAlign": "center"
					}}
				>
					<MaterialUI.CircularProgress />
				</div>
			);
		} else {
			return (
				<GameListElement
					summaryOnly={this.props.expansionPanelWrapped}
					game={el}
					key={el.Properties.ID}

				/>
			);
		}
	}
	render() {
		if (this.props.expansionPanelWrapped) {
			if (this.state.games.length == 0) {
				return "";
			} else if (this.state.games.length == 1) {
				return (
					<div
					style={{
						"width": "100%",
					}}
					>
						{this.renderElement(this.state.games[0])}
					</div>
				);
			} else {
				return (
					<div style={{"width":"100%"}}> 
						{this.state.games.map(game => {
						return this.renderElement(game);
					})}
								</div>
				);
			}
		} else {
			return (
				<div
					id="scroller"
					style={{
						overflowY: "scroll",
						height: "calc(100% - 60px)",
					}}
				>
					{this.state.games.map(game => {
						return this.renderElement(game);
					})}
				</div>
			);
		}
	}
}
