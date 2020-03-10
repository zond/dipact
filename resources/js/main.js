import Login from '%{ cb "./login.js" }%';
import MainMenu from '%{ cb "./main_menu.js" }%';
import Notifications from '%{ cb "./notifications.js" }%';
import ActivityContainer from '%{ cb "./activity_container.js" }%';

export default class Main extends ActivityContainer {
	constructor(props) {
		super(props);
		this.state = {
			activity: Login,
			urls: {},
			variants: []
		};
	}
	componentDidMount() {
		this.url = new URL(window.location.href);
		this.token = this.url.searchParams.get("token");
		this.server_url = new URL("https://diplicity-engine.appspot.com/");
		if (this.token) {
			this.server_url.searchParams.set("token", this.token);
			this.url.searchParams.delete("token");
			history.pushState("", "", this.url.toString());
			this.setActivity(MainMenu, { variants: this.state.variants });
		}
		let variantURL = new URL(this.server_url);
		variantURL.pathname = "/Variants";
		fetch(variantURL.toString(), {
			headers: { Accept: "application/json" }
		})
			.then(resp => resp.json())
			.then(js => {
				this.setState({ variants: js.Properties });
				if (this.state.activity == MainMenu) {
					this.setActivity(MainMenu, { variants: js.Properties });
				}
			});
		fetch(this.server_url.toString(), {
			headers: { Accept: "application/json" }
		})
			.then(resp => resp.json())
			.then(js => {
				this.setState((state, props) => {
					state = Object.assign({}, state);
					state.user = js.Properties.User;
					let login_link = js.Links.find(l => {
						return l.Rel == "login";
					});
					if (login_link) {
						let login_url = new URL(login_link.URL);
						login_url.searchParams.set(
							"redirect-to",
							this.url.toString()
						);
						state.urls.login_url = login_url;
					}
					let linkSetter = (rel, key) => {
						let link = js.Links.find(l => {
							return l.Rel == rel;
						});
						if (link) {
							state.urls[key] = new URL(link.URL);
						}
					};
					linkSetter("my-started-games", "my_started_games_url");
					linkSetter("my-staging-games", "my_staging_games_url");
					linkSetter("my-finished-games", "my_finished_games_url");
					linkSetter("open-games", "open_games_url");
					linkSetter("started-games", "started_games_url");
					linkSetter("finished-games", "finished_games_url");
					return state;
				});
			});
	}
}
