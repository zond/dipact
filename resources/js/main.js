import * as helpers from '%{ cb "./helpers.js" }%';

import Login from '%{ cb "./login.js" }%';
import MainMenu from '%{ cb "./main_menu.js" }%';
import Notifications from '%{ cb "./notifications.js" }%';
import ActivityContainer from '%{ cb "./activity_container.js" }%';

export default class Main extends ActivityContainer {
	constructor(props) {
		super(props);
		this.state = {
			activity: Login,
			urls: {}
		};
	}
	processToken() {
		let found_token = Globals.selfURL.searchParams.get("token");
		if (found_token) {
			Globals.selfURL.searchParams.delete("token");
			history.pushState("", "", Globals.selfURL.toString());
		}

		if (!found_token) {
			found_token = localStorage.getItem("token");
		}

		if (found_token) {
			Globals.token = found_token;
			Globals.serverRequest.headers.append(
				"Authorization",
				"bearer " + found_token
			);
		}
	}
	componentDidMount() {
		Globals.selfURL = new URL(window.location.href);
		this.processToken();
		helpers.incProgress();
		Promise.all([
			fetch(
				helpers.createRequest("/Variants", { unauthed: true })
			).then(resp => resp.json()),
			fetch(Globals.serverRequest).then(resp => {
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
		]).then(values => {
			helpers.decProgress();
			Globals.variants = values[0].Properties;
			let rootJS = values[1][0];
			let rootStatus = values[1][1];
			if (rootStatus == 401) {
				localStorage.removeItem("token");
				location.replace("/");
				return;
			}
			Globals.user = rootJS.Properties.User;
			this.setState((state, props) => {
				state = Object.assign({}, state);

				let login_link = rootJS.Links.find(l => {
					return l.Rel == "login";
				});
				if (login_link) {
					let login_url = new URL(login_link.URL);
					login_url.searchParams.set(
						"redirect-to",
						Globals.selfURL.toString()
					);
					state.urls.login_url = login_url;
				}

				let linkSetter = (rel, key) => {
					let link = rootJS.Links.find(l => {
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

				if (Globals.user) {
					localStorage.setItem("token", Globals.token);
					state.activity = MainMenu;
					state.activityProps = { urls: state.urls };
				} else if (state.urls.login_url) {
					state.activity = Login;
					state.activityProps = { loginURL: state.urls.login_url };
				}

				return state;
			});
		});
	}
}
