import * as helpers from '%{ cb "/js/helpers.js" }%';

import GameListElement from '%{ cb "/js/game_list_element.js" }%';

export default class GameList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			games: this.props.predefinedList || []
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
				games: this.props.predefinedList || [
					{ isProgress: true, Properties: { ID: "" + Math.random() } }
				]
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
		gtag("set", { page_title: "GameList", page_location: location.href });
		gtag("event", "page_view");
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
					games.push({
						isProgress: true,
						Properties: { ID: "" + Math.random() }
					});
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
						width: "100%",
						textAlign: "center",
						paddingTop: "calc(50% - 20px)",
						paddingBottom: "calc(50% - 20px)",
					}}
				>
					<MaterialUI.CircularProgress />
				</div>
			);
		} else {
			return (
				<GameListElement
					summaryOnly={this.props.contained}
					game={el}
					key={el.Properties.ID}
				/>
			);
		}
	}
	render() {
		if (this.props.contained) {
			return (
				<div style={{ width: "100%" }}>
					{this.state.games.map((game, idx) => {
						return (
							<React.Fragment key={game.Properties.ID}>
								{this.renderElement(game)}
								{idx < this.state.games.length - 1 ? (
									<MaterialUI.Divider
										light
										style={{ marginTop: "8px" }}
									/>
								) : (
									""
								)}
							</React.Fragment>
						);
					})}
				</div>
			);
		} else {
			return (
				<div
					id="scroller"
					style={{
						overflowY: "scroll",
						height: "calc(100% - 60px)"
					}}
				>
					{this.props.label ? this.props.label : ""}
					{this.state.games.map((game, idx) => {
						return this.renderElement(game);
					})}
				</div>
			);
		}
	}
}
