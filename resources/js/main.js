import * as helpers from '%{ cb "./helpers.js" }%';

import Globals from '%{ cb "./globals.js" }%';
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
	processToken() {
		let found_token = Globals.self_url.searchParams.get("token");
		if (found_token) {
			Globals.self_url.searchParams.delete("token");
			history.pushState("", "", Globals.self_url.toString());
		}

		if (!found_token) {
			found_token = localStorage.getItem("token");
		}

		if (found_token) {
			Globals.token = found_token;
			Globals.server_request.headers.append(
				"Authorization",
				"bearer " + found_token
			);
		}
	}
	componentDidMount() {
		Globals.self_url = new URL(window.location.href);
		this.processToken();
		fetch(helpers.createRequest("/Variants", { unauthed: true }))
			.then(resp => resp.json())
			.then(js => {
				this.setState({ variants: js.Properties });
				if (this.state.activity == MainMenu) {
					this.setActivity(MainMenu, { variants: js.Properties });
				}
			});
		fetch(Globals.server_request)
			.then(resp => {
				if (resp.status == 200) {
					return new Promise((resolve, reject) => {
						resp.json().then(js => {
							resolve([js, resp.status]);
						});
					});
				} else {
					return Promise.resolve([{}, resp.status]);
				}
			})
			.then(([js, status]) => {
				if (status == 401) {
					localStorage.removeItem("token");
					location.replace("/");
					return;
				}
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
							Globals.self_url.toString()
						);
						state.urls.login_url = login_url;
					}
					if (state.user) {
						state.activity = MainMenu;
						state.activity_props = { variants: state.variants };
						localStorage.setItem("token", Globals.token);
					} else if (state.urls.login_url) {
						state.activity = Login;
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
