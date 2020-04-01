import * as helpers from '%{ cb "/js/helpers.js" }%';

import Login from '%{ cb "/js/login.js" }%';
import MainMenu from '%{ cb "/js/main_menu.js" }%';
import ActivityContainer from '%{ cb "/js/activity_container.js" }%';

export default class Main extends ActivityContainer {
	constructor(props) {
		super(props);
		this.state = {
			activity: Login,
			urls: {}
		};
	}
	processToken() {
		let foundToken = Globals.selfURL.searchParams.get("token");
		if (foundToken) {
			Globals.selfURL.searchParams.delete("token");
			history.pushState("", "", Globals.selfURL.toString());
		}

		if (!foundToken) {
			foundToken = localStorage.getItem("token");
		}

		if (foundToken) {
			Globals.token = foundToken;
			Globals.serverRequest.headers.append(
				"Authorization",
				"bearer " + foundToken
			);
		}
	}
	componentDidMount() {
		Globals.selfURL = new URL(window.location.href);
		this.processToken();
		helpers.incProgress();
		Promise.all([
			helpers
				.safeFetch(
					helpers.createRequest("/Variants", { unauthed: true })
				)
				.then(resp => resp.json()),
			helpers.safeFetch(Globals.serverRequest).then(resp => resp.json())
		]).then(values => {
			helpers.decProgress();
			let variantsJS = values[0];
			Globals.variants = variantsJS.Properties;
			let rootJS = values[1];
			Globals.user = rootJS.Properties.User;
			this.setState((state, props) => {
				state = Object.assign({}, state);

				let loginLink = rootJS.Links.find(l => {
					return l.Rel == "login";
				});
				if (loginLink) {
					let loginURL = new URL(loginLink.URL);
					loginURL.searchParams.set(
						"redirect-to",
						Globals.selfURL.toString()
					);
					state.urls.login_url = loginURL;
				}

				let linkSetter = rel => {
					let link = rootJS.Links.find(l => {
						return l.Rel == rel;
					});
					if (link) {
						state.urls[rel] = new URL(link.URL);
					}
				};
				linkSetter("my-started-games");
				linkSetter("my-staging-games");
				linkSetter("my-finished-games");
				linkSetter("open-games");
				linkSetter("started-games");
				linkSetter("finished-games");

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
